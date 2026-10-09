// Redesign guard: every piece of real content survives the new design, and the
// page gains the landmarks/dialog semantics the old one lacked.
import { render, screen, fireEvent, within } from '@testing-library/react'
import { vi, beforeAll, afterEach, test, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import App from './App.jsx'
import { labs } from './data/labs.js'
import { certs } from './data/certs.js'

// pdf.js cannot run under jsdom; documents stay in their loading state.
vi.mock('./lib/pdf.js', () => ({
  loadPdf: () => new Promise(() => {}),
  renderPage: () => Promise.resolve(),
}))

beforeAll(() => {
  const noop = () => {}
  const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop), set: () => true })
  HTMLCanvasElement.prototype.getContext = () => ctx
  window.matchMedia = window.matchMedia || ((q) => ({
    matches: false, media: q, onchange: null,
    addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false,
  }))
  window.IntersectionObserver = window.IntersectionObserver || class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.ResizeObserver = window.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} }
  window.scrollTo = noop
})
afterEach(cleanup)

const hrefs = () => Array.from(document.querySelectorAll('a[href]'), (a) => a.getAttribute('href'))

test('identity and contact links survive', () => {
  render(<App />)
  const h1 = screen.getByRole('heading', { level: 1 })
  expect(h1).toHaveTextContent(/Yuuki/)
  expect(h1).toHaveTextContent(/Burleigh/)
  expect(document.body).toHaveTextContent('Network & Cloud Professional')
  const all = hrefs()
  expect(all).toContain('mailto:yuukiburleigh22@gmail.com')
  expect(all).toContain('https://linkedin.com/in/yuuki-burleigh')
  expect(all).toContain('https://github.com/Yuuki-Burleigh')
})

test('experience content survives verbatim', () => {
  render(<App />)
  const text = document.body.textContent
  for (const s of [
    'Information Technology Technician',
    'Ameri-tide',
    'Aug 2026',
    'Bellevue, WA',
    'Advise on and implement network solutions that deliver reliable connectivity while keeping private financial information secure.',
    'Segmented the network with VLANs and dedicated SSIDs so guests and unauthorized users cannot reach or intercept client financial data, and secured wireless access with WPA3-Enterprise authentication backed by RADIUS.',
    'Built Zapier workflows for AI email triage, consolidating multiple email providers into one centralized dashboard, plus a loan pipeline workflow tracking the assigned employee, last update, and current stage of every loan.',
  ]) expect(text).toContain(s)
})

test('all 12 labs and all 3 certs render with their verify links', () => {
  render(<App />)
  expect(labs).toHaveLength(12)
  expect(certs).toHaveLength(3)
  const text = document.body.textContent
  for (const lab of labs) expect(text).toContain(lab.title)
  const all = hrefs()
  for (const cert of certs) {
    expect(text).toContain(cert.name)
    expect(all).toContain(cert.verify)
  }
})

test('page has a main landmark, a working skip link, and section navigation', () => {
  render(<App />)
  const main = screen.getByRole('main')
  expect(main.id).toBeTruthy()
  const skip = screen.getByRole('link', { name: /skip to (main )?content/i })
  expect(skip).toHaveAttribute('href', `#${main.id}`)
  const nav = screen.getByRole('navigation')
  const navHrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))
  for (const id of ['experience', 'work', 'certs']) {
    expect(navHrefs).toContain(`#${id}`)
    expect(document.getElementById(id)).not.toBeNull()
  }
})

test('a lab opens in an accessible dialog that Escape closes', () => {
  render(<App />)
  const lab = labs[0]
  const opener = screen.getAllByRole('button', { name: new RegExp(lab.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })[0]
  fireEvent.click(opener)
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(dialog).toHaveAccessibleName(new RegExp(lab.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).toBeNull()
})
