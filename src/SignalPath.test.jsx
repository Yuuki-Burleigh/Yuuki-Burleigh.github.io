// Signal Path guard: the scroll film tells the real lab story chapter by chapter,
// degrades to still posters under reduced motion, and the 3D device has a no-WebGL fallback.
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { vi, beforeEach, afterEach, test, expect } from 'vitest'
import App from './App.jsx'
import { labs } from './data/labs.js'

vi.mock('./lib/pdf.js', () => ({
  loadPdf: () => new Promise(() => {}),
  renderPage: () => Promise.resolve(),
}))

let reduce = false
beforeEach(() => {
  const noop = () => {}
  const ctx2d = new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop), set: () => true })
  // jsdom has no WebGL: 2d works, webgl/webgl2 return null, as on a real browser with WebGL off.
  HTMLCanvasElement.prototype.getContext = (kind) => (kind === '2d' ? ctx2d : null)
  window.matchMedia = (q) => ({
    matches: q.includes('prefers-reduced-motion') ? reduce : false, media: q, onchange: null,
    addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false,
  })
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  window.scrollTo = noop
})
afterEach(() => { cleanup(); reduce = false })

const byTitle = (t) => labs.find((l) => l.title.startsWith(t)).title
const CHAPTERS = [
  ['Switch', ['Layer 2 Attacks', 'WPA2 & WPA2-Enterprise']],
  ['Router', ['Designing a Multi-Area OSPF', 'Designing a Multiprotocol Network with BGP']],
  ['Firewall', ['FortiGate-40F Factory Reset', 'PA-220 Firewall for a SOHO', 'PA-220 Web Filtering']],
  ['VPN', ['Configuring GlobalProtect', 'Configuring a Remote Access IPsec VPN']],
  ['Cloud', ['AWS Cloud Foundations: IAM', 'AWS Cloud Foundations: EBS', 'Local AI with Web UI']],
]

const region = () => screen.getByRole('region', { name: /signal path/i })

test('a Signal Path section exists and the nav links to it', () => {
  render(<App />)
  expect(region().id).toBe('signal-path')
  const navHrefs = within(screen.getByRole('navigation')).getAllByRole('link').map((a) => a.getAttribute('href'))
  expect(navHrefs).toContain('#signal-path')
})

test('five chapters in order, each naming its device and listing its real labs', () => {
  render(<App />)
  const chapters = within(region()).getAllByRole('article')
  expect(chapters).toHaveLength(5)
  const seen = []
  CHAPTERS.forEach(([device, titles], i) => {
    expect(within(chapters[i]).getByRole('heading')).toHaveTextContent(new RegExp(device, 'i'))
    for (const t of titles) {
      expect(chapters[i]).toHaveTextContent(byTitle(t))
      seen.push(byTitle(t))
    }
  })
  expect(new Set(seen).size).toBe(12)
  expect([...new Set(seen)].sort()).toEqual(labs.map((l) => l.title).sort())
})

test('a lab named in a chapter opens its document dialog', () => {
  render(<App />)
  const firewall = within(region()).getAllByRole('article')[2]
  const title = byTitle('PA-220 Web Filtering')
  fireEvent.click(within(firewall).getByRole('button', { name: new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }))
  expect(screen.getByRole('dialog')).toHaveAccessibleName(new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})

test('under reduced motion every chapter shows a still poster from the film', () => {
  reduce = true
  render(<App />)
  for (const chapter of within(region()).getAllByRole('article')) {
    const img = within(chapter).getByRole('img')
    expect(img.getAttribute('alt')).toBeTruthy()
    expect(img.getAttribute('src')).toMatch(/media\/signal\//)
  }
})

test('the 3D firewall falls back to a still image when WebGL is unavailable', async () => {
  render(<App />)
  const fallback = await screen.findByRole('img', { name: /firewall appliance/i })
  expect(fallback.getAttribute('src')).toMatch(/media\//)
})
