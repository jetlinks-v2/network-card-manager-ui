import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { buildSync } from 'esbuild'
import { effectScope } from 'vue'

const require = createRequire(import.meta.url)
function load(relative) {
  const compiled = buildSync({ entryPoints: [fileURLToPath(new URL(relative, import.meta.url))], bundle: true,
    platform: 'node', format: 'cjs', write: false, external: ['vue'] })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, module, module.exports)
  return module.exports
}
const { withListStatus, normalizeCardTerms, readCount } = load('../views/components/list/query.ts')
const { cardFlowSummary, formatCardFlow, flowProgressColor } = load('../views/CardManagement/flow.ts')
const { useListStatus } = load('../views/components/list/useListStatus.ts')
const options = [{ value: 'success', label: 'success' }, { value: 'failed', label: 'failed' }]
function setup(count, request = async () => ({ success: true })) {
  const scope = effectScope()
  const state = scope.run(() => useListStatus({ column: 'syncCardStatus', options, count, request, t: key => key }))
  return { state, scope }
}

test('quick status ANDs the complete OR expression without mutating search terms', () => {
  const query = { terms: [{ column: 'id', value: 'A' }, { column: 'id', value: 'B', type: 'or' }] }
  const before = JSON.stringify(query)
  const result = withListStatus(query, 'syncCardStatus', 'failed')
  assert.deepEqual(result.terms[0], { terms: query.terms })
  assert.deepEqual(result.terms[1], { column: 'syncCardStatus', termType: 'eq', value: 'failed', type: 'and' })
  assert.equal(JSON.stringify(query), before)
  assert.deepEqual(withListStatus(query, 'syncCardStatus', 'all'), query)
})

test('nested legacy NULL option is normalized without changing zero or false', () => {
  const terms = [{ terms: [{ column: 'flowError', value: 'flowError' }, { column: 'flowError', value: false }, { column: 'usedFlow', value: 0 }] }]
  const result = normalizeCardTerms(terms)
  assert.deepEqual(result[0].terms[0], { column: 'flowError', value: '', termType: 'isnull' })
  assert.equal(terms[0].terms[0].value, 'flowError')
  assert.equal(result[0].terms[1].value, false)
  assert.equal(result[0].terms[2].value, 0)
})

test('flow display distinguishes real zero, missing values and a zero denominator', () => {
  assert.deepEqual(cardFlowSummary({ usedFlow: 0, totalFlow: 0, residualFlow: 0 }), { used: 0, total: 0, residual: 0, remainingPercent: undefined })
  assert.equal(formatCardFlow(0), '0 MB')
  assert.equal(formatCardFlow(undefined), '—')
  assert.equal(cardFlowSummary({ residualFlow: NaN, totalFlow: 1024 }).remainingPercent, undefined)
  assert.equal(cardFlowSummary({ usedFlow: 100, totalFlow: 1024 }).remainingPercent, undefined)
  assert.equal(cardFlowSummary({ residualFlow: 2048, totalFlow: 1024 }).remainingPercent, 100)
  assert.equal(cardFlowSummary({ residualFlow: 0, totalFlow: 1024 }).remainingPercent, 0)
})

test('pool flow uses the pool denominator and balance', () => {
  assert.deepEqual(cardFlowSummary({ comboType: { value: 'pool' }, totalFlow: 0, poolTotalFlow: 200,
    poolResidualFlow: 150, residualFlow: 0, usedFlow: 50 }), { total: 200, residual: 150, used: 50, remainingPercent: 75 })
})

test('remaining-balance colors switch at 20%, independently of the used amount', () => {
  assert.equal(cardFlowSummary({ residualFlow: 60, totalFlow: 100, usedFlow: 0 }).remainingPercent, 60)
  assert.equal(flowProgressColor(undefined), undefined)
  assert.equal(flowProgressColor(0), 'var(--danger)')
  assert.equal(flowProgressColor(20), 'var(--danger)')
  assert.equal(flowProgressColor(20.01), 'var(--success)')
})

test('counts inherit the search but stay independent of the selected quick status', async () => {
  const calls = []
  const { state, scope } = setup(async query => { calls.push(query); return 0 })
  state.handleSearch({ terms: [{ column: 'id', value: 'A' }] })
  state.changeStatus('failed')
  await state.refreshCounts()
  assert.equal(calls.length, 3)
  assert.deepEqual(calls[0], { terms: [{ column: 'id', value: 'A' }] })
  assert.equal(calls[1].terms[1].value, 'success')
  assert.equal(state.params.value.terms[1].value, 'failed')
  assert.deepEqual(state.statusOptions.value.map(option => option.count), [0, 0, 0])
  scope.stop()
})

test('a failed count stays unknown while valid counts, including zero, remain visible', async () => {
  let calls = 0
  const { state, scope } = setup(async () => { if (++calls === 2) throw Error('offline'); return 0 })
  await state.refreshCounts()
  assert.deepEqual(state.statusOptions.value.map(option => option.count), [0, '—', 0])
  for (const value of [null, undefined, NaN, -1, '12']) assert.throws(() => readCount(value))
  scope.stop()
})

test('old requests and requests completed after disposal cannot replace counts', async () => {
  const pending = []
  const { state, scope } = setup(() => new Promise(resolve => pending.push(resolve)))
  const first = state.refreshCounts()
  state.handleSearch({ terms: [{ column: 'id', value: 'new' }] })
  const second = state.refreshCounts()
  pending.slice(3).forEach(resolve => resolve(8))
  await second
  pending.slice(0, 3).forEach(resolve => resolve(1))
  await first
  assert.equal(state.statusOptions.value[0].count, 8)
  const disposed = state.refreshCounts()
  scope.stop()
  pending.slice(6).forEach(resolve => resolve(3))
  await disposed
  assert.equal(state.statusOptions.value[0].count, '—')
})

test('list failures can be retried and an aborted response does not set an error', async () => {
  let fail = true
  const { state, scope } = setup(async () => 0, async () => { if (fail) throw Error('offline'); return { success: true } })
  await assert.rejects(state.requestList({}))
  assert.equal(state.listError.value, true)
  fail = false
  await state.requestList({})
  assert.equal(state.listError.value, false)
  const controller = new AbortController()
  controller.abort()
  fail = true
  await assert.rejects(state.requestList({}, { signal: controller.signal }))
  assert.equal(state.listError.value, false)
  scope.stop()
})
