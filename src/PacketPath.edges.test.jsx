// Round-two guard: the hero says plainly that the cards are lab reports, each card previews its
// report, cards are placed around each device instead of over it, the loop's edge paths hold,
// and shared links get a preview card.
import { readFileSync } from 'node:fs'
import { render, screen, fireEvent, within, cleanup, act } from '@testing-library/react'
import { vi, beforeEach, afterEach, test, expect } from 'vitest'
import App from './App.jsx'
import { stops, labsFor, placeCards, stopAt } from './data/stops.js'
import { labs } from './data/labs.js'

vi.mock('./lib/pdf.js', () => ({
  loadPdf: () => new Promise(() => {}),
  renderPage: () => Promise.resolve(),
}))

let played = 0
let paused = 0
let ioCallbacks = []
beforeEach(() => {
  const noop = () => {}
  played = 0; paused = 0; ioCallbacks = []
  window.matchMedia = (q) => ({ matches: false, media: q, onchange: null, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false })
  window.IntersectionObserver = class { constructor(cb) { ioCallbacks.push(cb) } observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  window.scrollTo = noop
  HTMLMediaElement.prototype.play = function () { played++; return Promise.resolve() }
  HTMLMediaElement.prototype.pause = function () { paused++ }
  HTMLMediaElement.prototype.load = noop
  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', { configurable: true,
    get() { return this._t || 0 }, set(v) { this._t = v } })
  const store = new Map()
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k), clear: () => store.clear() } })
})
afterEach(cleanup)

const unit = () => screen.getByRole('region', { name: /packet path/i })
const film = () => unit().querySelector('video')
const at = (t) => act(() => { film().currentTime = t; fireEvent(film(), new Event('timeupdate')) })

test('the hero unit tells recruiters these are lab reports, with a way to see them all', () => {
  render(<App />)
  expect(within(unit()).getByRole('heading', { name: /see my labs/i })).toBeInTheDocument()
  const all = within(unit()).getByRole('link', { name: new RegExp(`all ${labs.length} lab reports`, 'i') })
  expect(all).toHaveAttribute('href', '#work')
})

test('each emerging card is labelled as a lab report and previews the document', () => {
  render(<App />)
  fireEvent.click(within(within(unit()).getByRole('list', { name: /stops/i })).getAllByRole('button')[2])
  const cards = within(unit()).getAllByRole('button', { name: /lab report/i })
  expect(cards).toHaveLength(labsFor('firewall').length)
  for (const c of cards) {
    expect(c).toHaveTextContent(/lab report/i)
    expect(c.querySelector('canvas.chip__thumb')).not.toBeNull()
  }
})

test('every stop marks where its device sits, and no card is placed over the device', () => {
  const W = 1200, H = 520
  for (const s of stops) {
    const { x, y, w, h } = s.device
    for (const v of [x, y, w, h]) expect(v).toBeGreaterThan(0)
    expect(x - w).toBeGreaterThanOrEqual(0); expect(x + w).toBeLessThanOrEqual(1)
    const n = Math.max(3, labsFor(s.id).length)
    const spots = placeCards(s, n, W, H, { cw: 240, ch: 84 })
    expect(spots).toHaveLength(n)
    const box = spots.device
    for (const p of spots) {
      const overlapX = Math.abs(p.x - (box.left + box.right) / 2) < (box.right - box.left) / 2 + spots.cw / 2
      const overlapY = Math.abs(p.y - (box.top + box.bottom) / 2) < (box.bottom - box.top) / 2 + 42
      expect(overlapX && overlapY).toBe(false)
      expect(p.x - spots.cw / 2).toBeGreaterThanOrEqual(0); expect(p.x + spots.cw / 2).toBeLessThanOrEqual(W)
    }
  }
})

test('the hero is one continuous looping film with no holds', () => {
  render(<App />)
  expect(unit().querySelectorAll('video')).toHaveLength(1)
  expect(film()).toHaveAttribute('loop')
  expect(film().getAttribute("src")).toMatch(/media\/path\/v[0-9]+\/path\.mp4$/)
  for (const s of stops) expect(stopAt((s.t0 + s.t1) / 2)).toBe(s)
  expect(stopAt(5)).toBeNull()
})

test('reports come out while the camera passes a device, and clear between devices', () => {
  render(<App />)
  at(stops[2].t0 + 0.5)
  expect(within(unit()).getAllByRole('button', { name: /lab report/i })).toHaveLength(labsFor('firewall').length)
  at(5)
  expect(within(unit()).queryAllByRole('button', { name: /lab report/i })).toHaveLength(0)
  expect(unit()).toHaveTextContent(/next stop/i)
  expect(unit()).toHaveTextContent('Router')
})

test('choosing a stop jumps the film to that device and keeps it playing', () => {
  render(<App />)
  const before = played
  fireEvent.click(within(within(unit()).getByRole('list', { name: /stops/i })).getAllByRole('button')[3])
  expect(film().currentTime).toBeCloseTo(stops[3].t0, 1)
  expect(within(unit()).getAllByRole('button', { name: /lab report/i })).toHaveLength(labsFor('vpn').length)
  expect(within(unit()).getByRole('button', { name: /pause/i })).toBeInTheDocument()
  expect(played).toBeGreaterThanOrEqual(before)
})

test('the film pauses when the hero scrolls off screen', () => {
  render(<App />)
  const before = paused
  act(() => { ioCallbacks.forEach((cb) => cb([{ isIntersecting: false }])) })
  expect(paused).toBeGreaterThan(before)
})

test('shared links get a preview card and a Person profile', () => {
  const html = readFileSync('index.html', 'utf8')
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) expect(html).toContain(p)
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  expect(ld['@type']).toBe('Person')
  expect(ld.name).toBe('Yuuki Burleigh')
  expect(ld.sameAs).toEqual(expect.arrayContaining(['https://linkedin.com/in/yuuki-burleigh', 'https://github.com/Yuuki-Burleigh']))
})
