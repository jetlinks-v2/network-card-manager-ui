import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createSSRApp, h } from 'vue'
import { parse } from 'vue/compiler-sfc'
import { renderToString } from 'vue/server-renderer'

// Exercise the production template without a map SDK key or a chargeable location request.
const source = readFileSync(new URL('../views/CardManagement/Detail/CardLocation.vue', import.meta.url), 'utf8')
const template = parse(source).descriptor.template.content
async function render(state) {
  const app = createSSRApp({ template, setup: () => ({
    active: true, historySupported: true, failed: false, loading: false, marks: undefined,
    t: key => key, locate() {}, history() {}, ...state
  }) })
  app.component('RealTimeMap', { props: { marks: Array }, setup: p => () => h('div', { 'data-map-markers': p.marks?.length ?? 0 }) })
  for (const name of ['AButton', 'AIcon', 'ASpin', 'DetailLoadError']) app.component(name, () => h('span'))
  return renderToString(app)
}

test('the active location tab keeps the basemap for pending, empty and failed queries', async () => {
  for (const state of [{ loading: true }, { marks: [] }, { failed: true }]) {
    const html = await render(state)
    assert.match(html, /data-map-markers="0"/)
    assert.equal(html.includes('SimDetail.noLocation'), !state.loading && !state.failed)
  }
})

test('a returned fix supplies a marker and location text; an inactive tab does not mount a map', async () => {
  const marks = [{ longitude: 0, latitude: 0, location: 'Test location' }]
  const html = await render({ marks })
  assert.match(html, /data-map-markers="1"/)
  assert.match(html, /Test location/)
  assert.doesNotMatch(await render({ active: false, marks }), /data-map-markers/)
})
