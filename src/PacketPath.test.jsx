// Packet Path guard: the hero video walks a packet through six real devices, each device's
// labs come straight from labs.js (so a new lab needs no new video), and the hero stays usable
// without motion. Plus the light/dark toggle.
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { vi, beforeEach, afterEach, test, expect } from 'vitest'
import App from './App.jsx'
import { labs } from './data/labs.js'
import { stops, labsFor } from './data/stops.js'

vi.mock('./lib/pdf.js', () => ({
  loadPdf: () => new Promise(() => {}),
  renderPage: () => Promise.resolve(),
}))

let reduce = false
let played = 0
beforeEach(() => {
  const noop = () => {}
  played = 0
  window.matchMedia = (q) => ({
    matches: q.includes('prefers-reduced-motion') ? reduce : false, media: q, onchange: null,
    addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false,
  })
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  window.scrollTo = noop
  HTMLMediaElement.prototype.play = function () { played++; return Promise.resolve() }
  HTMLMediaElement.prototype.pause = noop
  HTMLMediaElement.prototype.load = noop
  const store = new Map()
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k), clear: () => store.clear() } })
  document.documentElement.removeAttribute('data-theme')
})
afterEach(() => { cleanup(); reduce = false })

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const unit = () => screen.getByRole('region', { name: /packet path/i })
const stopButtons = () => within(within(unit()).getByRole('list', { name: /stops/i })).getAllByRole('button')

test('six stops in order, and every lab sits in exactly one stop by its device', () => {
  expect(stops.map((s) => s.label)).toEqual(['Switch', 'Router', 'Firewall', 'VPN', 'Cloud', 'AI'])
  const seen = stops.flatMap((s) => labsFor(s.id).map((l) => l.title))
  expect(seen.slice().sort()).toEqual(labs.map((l) => l.title).sort())
  expect(new Set(seen).size).toBe(labs.length)
  expect(labsFor('ai').map((l) => l.title)).toContain('Local AI with Web UI Integration')
})

test('a new lab joins its device stop with no other change', () => {
  const extra = [...labs, { title: 'Fine-tuning a Small Model', desc: 'x', tag: 'AI', device: 'ai', file: 'labs/x.pdf' }]
  expect(labsFor('ai', extra).map((l) => l.title)).toContain('Fine-tuning a Small Model')
  expect(labsFor('switch', extra).map((l) => l.title)).not.toContain('Fine-tuning a Small Model')
})

test('the hero unit lists the six stops; choosing one shows its labs, and a lab opens its document', () => {
  render(<App />)
  const btns = stopButtons()
  expect(btns.map((b) => b.textContent)).toEqual(expect.arrayContaining(['Switch', 'Router', 'Firewall', 'VPN', 'Cloud', 'AI'].map((l) => expect.stringContaining(l))))
  fireEvent.click(btns[2])
  expect(btns[2]).toHaveAttribute('aria-current', 'step')
  const title = labsFor('firewall')[0].title
  const shown = within(unit()).getByRole('button', { name: new RegExp(esc(title)) })
  fireEvent.click(shown)
  expect(screen.getByRole('dialog')).toHaveAccessibleName(new RegExp(esc(title)))
})

test('the loop plays with a pause control', () => {
  render(<App />)
  expect(played).toBeGreaterThan(0)
  const pause = within(unit()).getByRole('button', { name: /pause/i })
  fireEvent.click(pause)
  expect(within(unit()).getByRole('button', { name: /play/i })).toBeInTheDocument()
})

test('under reduced motion nothing autoplays and the stop shows a still frame', () => {
  reduce = true
  render(<App />)
  expect(played).toBe(0)
  const img = within(unit()).getByRole('img')
  expect(img.getAttribute('src')).toMatch(/media\/path\//)
  expect(img.getAttribute('alt')).toBeTruthy()
})

test('theme is dark by default and the toggle switches to light and remembers it', () => {
  render(<App />)
  expect(document.documentElement.dataset.theme).toBe('dark')
  const toggle = screen.getByRole('switch', { name: /light mode/i })
  expect(toggle).toHaveAttribute('aria-checked', 'false')
  fireEvent.click(toggle)
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem('theme')).toBe('light')
})
