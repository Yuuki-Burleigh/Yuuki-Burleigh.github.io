import { render, cleanup, fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import SignalPath from './SignalPath'

let images, pending, draw, reduce, frameId
beforeEach(() => {
  images = []
  pending = new Map()
  draw = vi.fn()
  reduce = false
  frameId = 0
  vi.stubGlobal('requestAnimationFrame', callback => { pending.set(++frameId, callback); return frameId })
  vi.stubGlobal('cancelAnimationFrame', id => pending.delete(id))
  vi.stubGlobal('Image', class {
    constructor() { this.complete = false; this.naturalWidth = 1280; this.naturalHeight = 720; images.push(this) }
  })
  vi.stubGlobal('matchMedia', () => ({ matches: reduce, addEventListener() {}, removeEventListener() {} }))
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: draw })
  vi.stubGlobal('innerWidth', 1280)
  vi.stubGlobal('innerHeight', 800)
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const flush = () => {
  const callbacks = [...pending.values()]
  pending.clear()
  callbacks.forEach(callback => callback())
}
const loaded = image => { image.complete = true; image.onload?.(); flush() }

test('scroll selects an exact frame and retains it if the following frame fails', () => {
  const { container } = render(<SignalPath onOpen={() => {}} />)
  const section = container.querySelector('section')
  let top = -800 * 1.6 * .5
  section.getBoundingClientRect = () => ({ top })
  flush()
  const middle = images.find(img => img.src.endsWith('ch1/f073.avif'))
  loaded(middle)
  expect(draw.mock.lastCall[0]).toBe(middle)
  expect(section.querySelector('progress').value).toBe(.5)
  top = -800 * 1.6 * .75
  const failed = images.find(img => img.src.endsWith('ch1/f109.avif'))
  failed.onerror()
  fireEvent.scroll(window)
  flush()
  expect(draw.mock.lastCall[0]).toBe(middle)
})

test('narrow screens request every second frame, including both endpoints', () => {
  vi.stubGlobal('innerWidth', 390)
  render(<SignalPath onOpen={() => {}} />)
  flush()
  const chapter = images.filter(img => img.src.includes('/ch1/'))
  expect(chapter).toHaveLength(73)
  expect(chapter[0].src).toContain('f001.avif')
  expect(chapter.at(-1).src).toContain('f145.avif')
  expect(chapter.some(img => img.src.endsWith('f002.avif'))).toBe(false)
})

test('reduced motion uses five posters and never requests animation frames', () => {
  reduce = true
  const { container } = render(<SignalPath onOpen={() => {}} />)
  flush()
  expect(container.querySelector('canvas')).toBeNull()
  expect(container.querySelectorAll('article img')).toHaveLength(5)
  expect(images).toHaveLength(0)
  expect(draw).not.toHaveBeenCalled()
})

test('leaving a chapter releases old image callbacks, and unmount cancels redraws', () => {
  const { container, unmount } = render(<SignalPath onOpen={() => {}} />)
  const first = images[0]
  container.querySelector('section').getBoundingClientRect = () => ({ top: -800 * 1.6 * 2.5 })
  flush()
  expect(first.onload).toBeNull()
  expect(images.some(img => img.src.includes('/ch3/'))).toBe(true)
  expect(images.some(img => img.src.includes('/ch4/'))).toBe(true)
  fireEvent.scroll(window)
  unmount()
  expect(pending.size).toBe(0)
})
