import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { buildSync } from 'esbuild'
import { effectScope, nextTick } from 'vue'

const require = createRequire(import.meta.url)
const apiPath = '../../../api/cardManagement',
  locationPath = '../../../api/realtimePositioning'
function load(file, mocks = {}) {
  const { outputFiles } = buildSync({
    entryPoints: [fileURLToPath(new URL(`../views/CardManagement/Detail/${file}.ts`, import.meta.url))],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    external: ['vue', ...Object.keys(mocks)]
  })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputFiles[0].text)(
    (key) => mocks[key] ?? require(key),
    module,
    module.exports
  )
  return module.exports
}
const ok = (result) => ({ success: true, result })
const tick = () => new Promise((resolve) => setImmediate(resolve))
const { detailFlow, flowPoints, flowTotals, trendQuery, totalsQuery } = load('detailFlow')

test('single-card used percentage is based on its used amount; pool balance is not card usage', () => {
  assert.equal(detailFlow({ totalFlow: 100, residualFlow: 70, usedFlow: 26 }).usedPercent, 26)
  assert.equal(detailFlow({ totalFlow: 100, usedFlow: 0 }).usedPercent, 0)
  for (const card of [{ usedFlow: 0 }, { totalFlow: 0, usedFlow: 0 }, { totalFlow: 100 }])
    assert.equal(detailFlow(card).usedPercent, undefined)
  assert.deepEqual(
    detailFlow({ comboType: { value: 'pool' }, totalFlow: 1, usedFlow: 8, poolTotalFlow: 100, poolResidualFlow: 60 }),
    { pool: true, total: 100, used: 8, residual: 60, usedPercent: undefined }
  )
})

test('dashboard uses existing card/time/group contract; no data is not zero', () => {
  const rows = [
    { group: 'month', data: { timeString: '02', value: null } },
    { group: 'lastDay', data: { timeString: '01', value: 0 } }
  ]
  assert.deepEqual(flowTotals(rows), [0, undefined, undefined])
  assert.deepEqual(flowPoints(rows), [
    { time: '01', value: 0 },
    { time: '02', value: null }
  ])
  const totals = totalsQuery('A', (k) => k)
  assert.deepEqual(
    totals.map((q) => [q.group, q.params.time, q.params.cardId]),
    [
      ['lastDay', '1h', 'A'],
      ['month', '1d', 'A'],
      ['year', '1M', 'A']
    ]
  )
  const range = { type: 'week', start: 0, end: 6 * 86400000 },
    q = trendQuery('B', range)
  assert.deepEqual(
    [q.params.cardId, q.params.from, q.params.to, q.params.limit, q.params.time],
    ['B', 0, range.end, 7, '1d']
  )
})

test('overview requests only its card; an unmounted/older request cannot replace the current result', async () => {
  const calls = [],
    pending = [],
    jumps = []
  const api = {
    queryDetailById: (id) => {
      calls.push(id)
      return new Promise((resolve) => pending.push(resolve))
    },
    queryDeactivate: async (id) => {
      calls.push(`reason:${id}`)
      return ok({ message: 'reason' })
    }
  }
  const { useCardDetail } = load('useCardDetail', {
    [apiPath]: api,
    'vue-router': { useRoute: () => ({ query: { src: 'list' } }) },
    '@jetlinks-web-core/store': { useMenuStore: () => ({ jumpPage: (...args) => jumps.push(args) }) }
  })
  const a = effectScope(),
    old = a.run(() => useCardDetail('A'))
  a.stop()
  const b = effectScope(),
    page = b.run(() => useCardDetail('B'))
  assert.deepEqual(calls, ['A', 'B'])
  pending[1](ok({ id: 'B', deviceId: 'sensor', poolId: 'pool' }))
  await tick()
  pending[0](ok({ id: 'A' }))
  await tick()
  assert.equal(old.card.data.value, undefined)
  assert.equal(page.card.data.value.id, 'B')
  page.openRelation('device')
  page.openRelation('pool')
  page.back()
  assert.deepEqual(
    jumps.map(([menu, options]) => [menu, options]),
    [
      ['device/Instance/Detail', { params: { id: 'sensor' } }],
      ['iot-card/TrafficPoolManagement/Detail', { params: { id: 'pool' } }],
      ['iot-card/CardManagement', { query: { src: 'list' } }]
    ]
  )
  page.afterEdit(false)
  assert.equal(calls.length, 2)
  page.afterEdit(true)
  const newer = page.refresh()
  pending[3](ok({ id: 'B', name: 'edited', operatorName: 'onelink', cardStateType: { value: 'deactivate' } }))
  await newer
  await tick()
  pending[2](ok({ id: 'B', name: 'old' }))
  await tick()
  assert.equal(page.card.data.value.name, 'edited')
  assert.equal(page.reason.value, 'reason')
  page.select('statistics')
  page.select('overview')
  assert.equal(page.visited.value.has('statistics'), true)
  b.stop()
})

test('history/retry never invoke the potentially billable endpoint; Unicom skips initial history', async () => {
  const calls = []
  let finish
  const { useCardLocation } = load('useCardLocation', {
    [apiPath]: {
      queryLocationById: async (id) => {
        calls.push(`history:${id}`)
        return ok(null)
      }
    },
    [locationPath]: {
      getPositionById: (id) => {
        calls.push(`live:${id}`)
        return new Promise((resolve) => {
          finish = resolve
        })
      }
    }
  })
  const scope = effectScope(),
    map = scope.run(() => useCardLocation('A', true))
  await tick()
  assert.deepEqual(map.position.data.value, [])
  await map.history()
  assert.deepEqual(calls, ['history:A', 'history:A'])
  const active = map.locate()
  map.locate()
  finish(ok({ longitude: 0, latitude: 0, error: false }))
  await active
  assert.deepEqual(calls, ['history:A', 'history:A', 'live:A'])
  assert.equal(map.position.data.value[0].latitude, 0)
  const s = effectScope(),
    unicom = s.run(() => useCardLocation('B', false))
  await unicom.history()
  assert.equal(calls.length, 3)
  scope.stop()
  s.stop()
})

test('out-of-order time range changes and failed requests do not overwrite fresher statistics', async () => {
  const pending = []
  const { useCardStatistics } = load('useCardStatistics', {
    [apiPath]: {
      dashboard: (q) => (Array.isArray(q) ? Promise.resolve(ok([])) : new Promise((resolve) => pending.push(resolve)))
    }
  })
  const scope = effectScope(),
    stats = scope.run(() => useCardStatistics('A', (k) => k))
  await tick()
  const range = { type: 'day', start: 0, end: 60 }
  const first = stats.loadTrend(range),
    second = stats.loadTrend({ ...range, end: 100 })
  pending[1](ok([{ data: { timeString: 'new', value: 10 } }]))
  await second
  pending[0]({ success: false })
  await first
  assert.equal(stats.trend.data.value[0].time, 'new')
  assert.equal(stats.trend.failed.value, false)
  const retry = stats.loadTrend()
  pending[2]({ success: false })
  await retry
  await nextTick()
  assert.equal(stats.trend.failed.value, true)
  scope.stop()
})

test('an empty detail is not rendered as a card; a rejected read can be retried', async () => {
  const replies = [() => Promise.reject(new Error('network')), () => ok({}), () => ok({ id: 'A' })]
  const { useCardDetail } = load('useCardDetail', {
    [apiPath]: { queryDetailById: () => replies.shift()() },
    'vue-router': { useRoute: () => ({ query: {} }) },
    '@jetlinks-web-core/store': { useMenuStore: () => ({}) }
  })
  const scope = effectScope()
  const page = scope.run(() => useCardDetail('A'))
  await tick()
  assert.equal(page.card.failed.value, true)
  await page.refresh()
  assert.equal(page.card.failed.value, false)
  assert.equal(page.card.data.value, undefined)
  await page.refresh()
  assert.equal(page.card.data.value.id, 'A')
  scope.stop()
})
