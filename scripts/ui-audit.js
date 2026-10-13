// UI audit for the portfolio, run in a real browser page (Playwright `page.evaluate(src)`, the Playwright MCP
// `browser_evaluate`, or the DevTools console) against `npm run build && npx vite preview`.
// Returns JSON: horizontal overflow, WCAG AA contrast for every visible text node in BOTH themes, and, for each
// hero stop, whether its lab-report cards stay inside the film window, clear of the caption and of each other.
async () => {
  const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number)
  const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0)
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e), c = parse(cs.backgroundColor)
      if (c.length && (c.length < 4 || c[3] > 0.85)) return c
      const g = (cs.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(parse).find((v) => v.length < 4 || v[3] > 0.85)
      if (g) return g                                     // first opaque gradient stop; texture overlays are translucent
    }
    return [10, 11, 13]
  }
  const contrast = () => {
    const bad = []; let checked = 0
    for (const el of document.querySelectorAll('body *')) {
      if (![...el.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim())) continue
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0 || el.closest('[aria-hidden="true"]') && el.closest('.sr-only')) continue
      const a = lum(parse(cs.color)), b = lum(bgOf(el)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700)
      checked++; if (ratio < (large ? 3 : 4.5)) bad.push([el.className || el.tagName, el.textContent.trim().slice(0, 40), +ratio.toFixed(2)])
    }
    return { checked, bad }
  }
  const out = { width: innerWidth, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth }
  const rocker = document.querySelector('.rocker')
  for (const theme of ['dark', 'light']) {
    if ((rocker.getAttribute('aria-checked') === 'true') !== (theme === 'light')) rocker.click()
    await new Promise((r) => setTimeout(r, 250)); out[theme] = contrast()
  }
  if ((rocker.getAttribute('aria-checked') === 'true')) rocker.click()
  const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  out.stops = []
  for (const btn of document.querySelectorAll('.stops button')) {
    btn.click(); await new Promise((r) => setTimeout(r, 1600))
    const win = document.querySelector('.path__window').getBoundingClientRect()
    const cap = document.querySelector('.path__caption').getBoundingClientRect()
    const cards = [...document.querySelectorAll('.path__labs li')].map((li) => li.getBoundingClientRect())
    out.stops.push({ stop: btn.textContent.trim(), cards: cards.length,
      inWindow: cards.every((c) => c.left >= win.left - 1 && c.right <= win.right + 1 && c.top >= win.top - 1 && c.bottom <= win.bottom + 1),
      clearOfCaption: !cards.some((c) => hit(c, cap)), clearOfEachOther: !cards.some((a, i) => cards.some((b, j) => i < j && hit(a, b))) })
  }
  return JSON.stringify(out)
}
