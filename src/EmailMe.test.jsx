// "Email me" opens a chooser: webmail compose windows with the address pre-filled, the mail app, or copy.
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { vi, beforeAll, afterEach, test, expect } from 'vitest'
import App from './App.jsx'
import { profile } from './data/certs.js'

vi.mock('./lib/pdf.js', () => ({ loadPdf: () => new Promise(() => {}), renderPage: () => Promise.resolve() }))

beforeAll(() => {
  const noop = () => {}
  window.matchMedia = (q) => ({ matches: false, media: q, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false })
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.scrollTo = noop
})
afterEach(cleanup)

const to = encodeURIComponent(profile.email)

test('every Email me opens a chooser with the address pre-filled for each webmail, and Escape closes it', () => {
  render(<App />)
  const triggers = screen.getAllByRole('link', { name: 'Email me' })
  expect(triggers.length).toBeGreaterThanOrEqual(3)
  for (const trigger of triggers) {
    expect(trigger).toHaveAttribute('href', `mailto:${profile.email}`)
    fireEvent.click(trigger)
    const pop = screen.getByRole('dialog', { name: /email me/i })
    const hrefs = within(pop).getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs.some((h) => h.startsWith('https://mail.google.com/') && h.includes(`to=${to}`))).toBe(true)
    expect(hrefs.some((h) => h.startsWith('https://outlook.live.com/') && h.includes(`to=${to}`))).toBe(true)
    expect(hrefs.some((h) => h.startsWith('https://compose.mail.yahoo.com/') && h.includes(`to=${to}`))).toBe(true)
    expect(within(pop).getByRole('button', { name: /copy/i })).toBeInTheDocument()
    expect(within(pop).getByRole('button', { name: /mail app/i })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: /email me/i })).toBeNull()
  }
})
