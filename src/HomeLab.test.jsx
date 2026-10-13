// redesign-v3 task test: the home-lab hero files every lab on the device it was built on.
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { vi, beforeAll, afterEach, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import App from './App.jsx'
import { labs } from './data/labs.js'
import { stops, plate } from './data/homelab.js'

vi.mock('./lib/pdf.js', () => ({
  loadPdf: () => new Promise(() => {}),
  renderPage: () => Promise.resolve(),
}))

let reduce = false
beforeAll(() => {
  const noop = () => {}
  const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop), set: () => true })
  HTMLCanvasElement.prototype.getContext = () => ctx
  window.matchMedia = (q) => ({
    matches: reduce && /prefers-reduced-motion:\s*reduce/.test(q), media: q, onchange: null,
    addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false,
  })
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  window.scrollTo = noop
})
afterEach(() => { cleanup(); reduce = false; document.documentElement.removeAttribute('data-theme') })

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const plural = (n) => `${n} lab${n === 1 ? '' : 's'}`
const deviceButton = (stop) =>
  screen.getByRole('button', { name: new RegExp(`${esc(stop.name)}.*${plural(stop.labs.length)}`, 'i') })

test('the hero shows the home-lab plate at every size', () => {
  render(<App />)
  const img = screen.getByAltText(plate.alt)
  const srcset = img.getAttribute('srcset') || ''
  for (const s of plate.sources) expect(srcset).toContain(`${s.src} ${s.w}w`)
  expect(img).toHaveAttribute('width', String(plate.width))
  expect(img).toHaveAttribute('height', String(plate.height))
})

test('every lab is filed on exactly one device', () => {
  const filed = stops.flatMap((s) => s.labs)
  expect(filed).toHaveLength(labs.length)
  expect(new Set(filed).size).toBe(labs.length)
  for (const t of filed) expect(labs.map((l) => l.title)).toContain(t)
})

test('each device is a button naming the device and its lab count, switch first and current', () => {
  render(<App />)
  expect(stops.map((s) => s.id)).toEqual(['switch', 'router', 'firewall', 'vpn', 'cloud', 'ai'])
  for (const stop of stops) expect(deviceButton(stop)).toBeInTheDocument()
  expect(deviceButton(stops[0])).toHaveAttribute('aria-current', 'step')
  expect(deviceButton(stops[1])).not.toHaveAttribute('aria-current')
})

test('next and previous device controls move the current device', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /next device/i }))
  expect(deviceButton(stops[1])).toHaveAttribute('aria-current', 'step')
  expect(deviceButton(stops[0])).not.toHaveAttribute('aria-current')
  fireEvent.click(screen.getByRole('button', { name: /previous device/i }))
  expect(deviceButton(stops[0])).toHaveAttribute('aria-current', 'step')
})

test("picking a device lists exactly that device's labs, and a lab opens its document", () => {
  render(<App />)
  const fw = stops.find((s) => s.id === 'firewall')
  fireEvent.click(deviceButton(fw))
  const panel = screen.getByRole('region', { name: new RegExp(`${esc(fw.name)} labs`, 'i') })
  const listed = within(panel).getAllByRole('button').map((b) => b.textContent)
  for (const t of fw.labs) expect(listed.some((x) => x.includes(t))).toBe(true)
  for (const other of stops.filter((s) => s.id !== 'firewall').flatMap((s) => s.labs))
    expect(listed.some((x) => x.includes(other))).toBe(false)
  fireEvent.click(within(panel).getByRole('button', { name: new RegExp(esc(fw.labs[0])) }))
  expect(screen.getByRole('dialog')).toHaveAccessibleName(new RegExp(esc(fw.labs[0])))
})

test('the lab index groups all twelve labs under their devices', () => {
  render(<App />)
  const work = document.getElementById('work')
  expect(work).not.toBeNull()
  for (const stop of stops) {
    const group = within(work).getByRole('group', { name: new RegExp(`^${esc(stop.name)}$`, 'i') })
    const text = group.textContent
    for (const t of stop.labs) expect(text).toContain(t)
  }
})

test('motion plays by default and holds still under reduced motion', () => {
  const { unmount } = render(<App />)
  expect(document.querySelector('[data-motion]')).toHaveAttribute('data-motion', 'play')
  unmount()
  reduce = true
  render(<App />)
  expect(document.querySelector('[data-motion]')).toHaveAttribute('data-motion', 'still')
})

test('dark is the default theme and the toggle switches to light', () => {
  render(<App />)
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  const toggle = screen.getByRole('button', { name: /light mode|dark mode|theme/i })
  expect(toggle).toHaveAttribute('aria-pressed')
  fireEvent.click(toggle)
  expect(document.documentElement).toHaveAttribute('data-theme', 'light')
})

test('one contact label, no dashes as punctuation, no Google Fonts link', () => {
  render(<App />)
  const mail = Array.from(document.querySelectorAll('a[href^="mailto:"]'))
  expect(mail.length).toBeGreaterThan(0)
  for (const a of mail) expect(a.textContent.trim()).toBe('Email me')
  expect(document.body.textContent).not.toMatch(/[–—]/)
  const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
  expect(html).not.toMatch(/fonts\.googleapis\.com/)
  expect(html).not.toMatch(/[–—]/)
})
