// Earlier versions stay live under /versions/<slug>/ and the footer links every one listed in versions.json.
import { render, cleanup } from '@testing-library/react'
import { vi, beforeAll, afterEach, test, expect } from 'vitest'
import App from './App.jsx'
import versions from '../versions.json'

vi.mock('./lib/pdf.js', () => ({ loadPdf: () => new Promise(() => {}), renderPage: () => Promise.resolve() }))
beforeAll(() => {
  const noop = () => {}
  window.matchMedia = (q) => ({ matches: false, media: q, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false })
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
  window.scrollTo = noop
})
afterEach(cleanup)

test('the footer links every earlier version at its own path', () => {
  render(<App />)
  const list = document.querySelector('[aria-label="Earlier versions of this site"]')
  expect(list).not.toBeNull()
  const hrefs = Array.from(list.querySelectorAll('a'), (a) => a.getAttribute('href'))
  expect(hrefs).toEqual(versions.map((v) => `/versions/${v.slug}/`))
  expect(new Set(versions.map((v) => v.slug)).size).toBe(versions.length)
})
