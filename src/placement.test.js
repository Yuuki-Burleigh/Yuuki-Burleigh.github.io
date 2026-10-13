// Card placement across real window sizes (the 1024 px overlap found by the UI audit): for every stop and
// for 1-4 reports, cards stay inside the window, off the device, off the caption, and off each other.
import { test, expect } from 'vitest'
import { stops, placeCards } from './data/stops.js'

const CH = 96, RESERVE = { w: 410, h: 120 }
import { labsFor } from './data/stops.js'
const sizes = [[730, 300], [780, 330], [1016, 390], [1100, 420], [1200, 520], [1360, 560], [1600, 700]]
const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b

test('cards never overlap the device, the caption, each other, or the window edge', () => {
  for (const [W, H] of sizes) for (const s of stops) for (let n = 1; n <= 4; n++) {
    const spots = placeCards(s, n, W, H, { cw: 264, ch: CH, reserve: RESERVE })
    if (!spots) continue                                 // the player docks the list under the film instead
    const cw = spots.cw
    const boxes = spots.map((p) => ({ l: p.x - cw / 2, r: p.x + cw / 2, t: p.y - CH / 2, b: p.y + CH / 2 }))
    const dev = { l: spots.device.left, r: spots.device.right, t: spots.device.top, b: spots.device.bottom }
    const cap = s.caption === 'top' ? { l: 0, r: RESERVE.w, t: 0, b: RESERVE.h } : { l: 0, r: RESERVE.w, t: H - RESERVE.h, b: H }
    const where = `${s.id} n=${n} at ${W}x${H}`
    boxes.forEach((a, i) => {
      expect(a.l >= 0 && a.r <= W && a.t >= 0 && a.b <= H, `inside window: ${where}`).toBe(true)
      expect(hit(a, cap), `clear of caption: ${where}`).toBe(false)
      boxes.forEach((b, j) => { if (i < j) expect(hit(a, b), `cards apart: ${where}`).toBe(false) })
    })
    const overDevice = boxes.filter((a) => hit(a, dev)).length
    expect(overDevice, `off the device: ${where}`).toBe(0)
  }
})

test('at common desktop window sizes every stop places its current reports beside the device', () => {
  for (const [W, H] of [[1016, 390], [1100, 420], [1200, 520], [1360, 560], [1600, 700]]) {
    for (const s of stops) expect(placeCards(s, labsFor(s.id).length, W, H, { cw: 264, ch: CH, reserve: RESERVE }), `${s.id} at ${W}x${H}`).not.toBeNull()
  }
})
