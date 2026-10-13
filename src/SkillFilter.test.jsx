// Skills-to-proof filter: a recruiter picks a skill and sees which labs prove it, in the index and on the hero.
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { vi, beforeAll, afterEach, test, expect } from 'vitest'
import App from './App.jsx'
import { labs, skills } from './data/labs.js'
import { stops } from './data/homelab.js'

vi.mock('./lib/pdf.js', () => ({ loadPdf: () => new Promise(() => {}), renderPage: () => Promise.resolve() }))

beforeAll(() => {
  const noop = () => {}
  window.matchMedia = (q) => ({ matches: false, media: q, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false })
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.scrollTo = noop
})
afterEach(cleanup)

const work = () => document.getElementById('work')

test('every lab carries a short problem and what was configured', () => {
  render(<App />)
  for (const lab of labs) {
    expect(lab.problem.length).toBeGreaterThan(20)
    expect(lab.did.length).toBeGreaterThan(20)
    expect(work().textContent).toContain(lab.did)
  }
})

test('every skill chip is proven by at least one lab, and none starts pressed', () => {
  render(<App />)
  const bar = within(work()).getByRole('group', { name: /filter by skill/i })
  for (const skill of skills) {
    expect(labs.some((l) => l.skills.includes(skill))).toBe(true)
    expect(within(bar).getByRole('button', { name: new RegExp(`^${skill}`) })).toHaveAttribute('aria-pressed', 'false')
  }
})

test('picking a skill marks exactly the labs that prove it, on the index and the hero devices', () => {
  render(<App />)
  const bar = within(work()).getByRole('group', { name: /filter by skill/i })
  fireEvent.click(within(bar).getByRole('button', { name: /^VPN/ }))
  expect(within(bar).getByRole('button', { name: /^VPN/ })).toHaveAttribute('aria-pressed', 'true')
  const rows = Array.from(work().querySelectorAll('.lab-row'))
  const vpnTitles = labs.filter((l) => l.skills.includes('VPN')).map((l) => l.title)
  for (const row of rows) {
    const matched = vpnTitles.some((t) => row.textContent.includes(t))
    expect(row.getAttribute('data-match')).toBe(matched ? 'true' : 'false')
  }
  // hero stepper: devices with a VPN lab are marked, the rest are not
  for (const stop of stops) {
    const has = stop.labs.some((t) => vpnTitles.includes(t))
    const tape = screen.getAllByRole('button', { name: new RegExp(`^${stop.name}`) }).find((b) => b.closest('.device-steps'))
    expect(tape.getAttribute('data-match')).toBe(has ? 'true' : 'false')
  }
  // pressing it again clears the filter
  fireEvent.click(within(bar).getByRole('button', { name: /^VPN/ }))
  expect(work().querySelector('[data-match="false"]')).toBeNull()
})
