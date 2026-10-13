import { labs } from './labs.js'

// Every hero film rendered so far. The build picks one with VITE_FILM (default v4) so each can be served and compared.
// Per film and stop: [t0, t1] is the hold where that device is on screen, `at` the frame stopN.webp shows, and
// `device` where the device sits in that frame (centre x/y, half width/height, 0-1) so lab reports come out beside it.
const FILMS = {
  v2: {
    label: 'v2 · Kling, scene per device', length: 64.64,
    stops: {
      switch: { t0: 4.99, t1: 9.79, at: 7.39, device: { x: 0.5, y: 0.49, w: 0.37, h: 0.1 } },
      router: { t0: 14.78, t1: 19.58, at: 17.18, device: { x: 0.5, y: 0.51, w: 0.34, h: 0.15 } },
      firewall: { t0: 24.58, t1: 30.28, at: 27.43, device: { x: 0.48, y: 0.47, w: 0.2, h: 0.11 } },
      vpn: { t0: 35.27, t1: 40.07, at: 37.67, device: { x: 0.48, y: 0.46, w: 0.46, h: 0.07 } },
      cloud: { t0: 45.06, t1: 49.86, at: 47.46, device: { x: 0.5, y: 0.45, w: 0.4, h: 0.06 } },
      ai: { t0: 54.85, t1: 59.65, at: 57.25, device: { x: 0.55, y: 0.53, w: 0.27, h: 0.27 } },
    },
  },
  v3: {
    label: 'v3 · Kling, on-prem data centre', length: 69.63,
    stops: {
      switch: { t0: 4.99, t1: 9.79, at: 7.39, device: { x: 0.46, y: 0.3, w: 0.2, h: 0.26 } },
      router: { t0: 14.78, t1: 19.58, at: 17.18, device: { x: 0.5, y: 0.26, w: 0.27, h: 0.26 } },
      firewall: { t0: 24.58, t1: 30.28, at: 27.43, device: { x: 0.51, y: 0.28, w: 0.24, h: 0.28 } },
      vpn: { t0: 40.26, t1: 45.06, at: 42.66, device: { x: 0.44, y: 0.41, w: 0.38, h: 0.1 } },
      cloud: { t0: 50.05, t1: 54.85, at: 52.45, device: { x: 0.79, y: 0.2, w: 0.07, h: 0.2 } },
      ai: { t0: 59.84, t1: 64.64, at: 62.24, device: { x: 0.5, y: 0.6, w: 0.34, h: 0.23 } },
    },
  },
  v35: {
    label: 'v3.5 · Seedance, one continuous take', length: 41.25,
    stops: {
      switch: { t0: 0.3, t1: 3.2, at: 1.0, device: { x: 0.5, y: 0.55, w: 0.27, h: 0.06 } },
      router: { t0: 7.6, t1: 10.6, at: 9.0, device: { x: 0.52, y: 0.72, w: 0.31, h: 0.09 } },
      firewall: { t0: 12.2, t1: 14.8, at: 13.5, device: { x: 0.51, y: 0.65, w: 0.26, h: 0.35 } },
      vpn: { t0: 22.5, t1: 29.0, at: 26.0, device: { x: 0.5, y: 0.75, w: 0.2, h: 0.26 } },
      cloud: { t0: 32.6, t1: 36.6, at: 34.5, device: { x: 0.5, y: 0.2, w: 0.06, h: 0.2 } },
      ai: { t0: 37.3, t1: 39.0, at: 37.8, device: { x: 0.51, y: 0.65, w: 0.21, h: 0.35 } },
    },
  },
  v4: {
    label: 'v4 · Seedance transitions with holds', length: 59.46,
    stops: {
      switch: { t0: 0, t1: 4.8, at: 2.4, device: { x: 0.47, y: 0.49, w: 0.21, h: 0.05 } },
      router: { t0: 10.84, t1: 15.64, at: 13.2, device: { x: 0.51, y: 0.48, w: 0.42, h: 0.1 } },
      firewall: { t0: 20.89, t1: 26.59, at: 23.7, device: { x: 0.54, y: 0.48, w: 0.34, h: 0.08 } },
      vpn: { t0: 31.14, t1: 35.94, at: 33.5, caption: 'top', device: { x: 0.27, y: 0.62, w: 0.16, h: 0.11 } },
      cloud: { t0: 43.93, t1: 48.73, at: 46.3, device: { x: 0.6, y: 0.41, w: 0.31, h: 0.09 } },
      ai: { t0: 54.72, t1: 59.4, at: 56.5, device: { x: 0.5, y: 0.56, w: 0.04, h: 0.34 } },
    },
  },
}

export const filmId = FILMS[import.meta.env?.VITE_FILM] ? import.meta.env.VITE_FILM : 'v4'
const F = FILMS[filmId]

const BASE = [
  { id: 'switch', label: 'Switch', layer: 'Layer 2', does: 'Forwards frames between devices on the local network.' },
  { id: 'router', label: 'Router', layer: 'Layer 3', does: 'Routes packets between networks.' },
  { id: 'firewall', label: 'Firewall', layer: 'Layers 4 to 7', does: 'Inspects traffic and enforces policy.' },
  { id: 'vpn', label: 'VPN', layer: 'Tunnel', does: 'Carries private traffic through an encrypted tunnel to another site.' },
  { id: 'cloud', label: 'Cloud', layer: 'Infrastructure', does: 'The cloud provider\'s edge, where compute, storage and networking run as a service.' },
  { id: 'ai', label: 'AI', layer: 'Compute', does: 'Runs models on dedicated accelerators.' },
]

export const stops = BASE.map((s, i) => ({ ...s, ...F.stops[s.id], poster: `media/path/${filmId}/stop${i + 1}.webp` }))

export const film = { id: filmId, label: F.label, src: `media/path/${filmId}/path.mp4`, poster: `media/path/${filmId}/start.webp`, length: F.length }

// The stop whose stretch of film contains time t, or null between stops.
export const stopAt = (t) => stops.find((s) => t >= s.t0 && t <= s.t1) || null

export const labsFor = (device, list = labs) => list.filter((lab) => lab.device === device)

// Card centres (px) for n lab reports around a stop's device in a W x H window that shows the
// 16:9 frame with object-fit: cover. Beside the device when there is room on both sides, else one
// side, else a row above or below it. The returned array also carries the device box, its centre and the card
// width used. Returns null when the cards cannot all sit clear of the device, the caption, the window edge and
// each other; the player then lists them under the film instead.
// `reserve` is the device caption's rectangle at the left edge, bottom-left by default or top-left when the stop
// sets caption: 'top' (used where the device sits low in the frame); cards must stay clear of it.
export function placeCards(stop, n, W, H, { cw: cw0 = 260, ch = 84, gap = 14, pad = 12, reserve = { w: 0, h: 0 } } = {}) {
  let cw = cw0
  const Fw = Math.max(W, (H * 16) / 9), Fh = (Fw * 9) / 16
  const ox = (W - Fw) / 2, oy = (H - Fh) / 2
  const { x, y, w, h } = stop.device
  const box = { left: ox + (x - w) * Fw, right: ox + (x + w) * Fw, top: oy + (y - h) * Fh, bottom: oy + (y + h) * Fh }
  const cy = (box.top + box.bottom) / 2
  const room = { L: box.left - pad, R: W - box.right - pad, T: box.top - pad, B: H - box.bottom - pad }
  const need = cw + gap
  const capTop = stop.caption === 'top'
  const inReserve = (px, py) => !capTop && px - cw / 2 < reserve.w && py + ch / 2 > H - reserve.h
  const clampY = (v, px) => Math.min((px !== undefined && inReserve(px, v) ? H - reserve.h - 8 : H - pad) - ch / 2, Math.max(pad + ch / 2, v))
  const clampX = (v) => Math.min(W - pad - cw / 2, Math.max(pad + cw / 2, v))
  const column = (count, cx) => {
    const ys = Array.from({ length: count }, (_, i) => cy + (i - (count - 1) / 2) * (ch + 10))
    const top = Math.min(...ys) - ch / 2, low = Math.max(...ys) + ch / 2
    const limit = inReserve(cx, Math.max(...ys)) ? H - reserve.h - 8 : H - pad
    const down = Math.max(0, pad - top)                   // push a column that starts above the frame back down
    const shift = down + Math.min(0, limit - (low + down)) // then lift it clear of the caption or the bottom edge
    return ys.map((v) => ({ x: cx, y: v + shift }))
  }
  let spots
  if (Math.min(room.L, room.R) >= Math.min(need, 200 + gap)) {
    cw = Math.min(cw, Math.min(room.L, room.R) - gap)    // both sides have room: narrow the cards to fit if needed
    const left = column(Math.ceil(n / 2), box.left - gap - cw / 2)
    const right = column(Math.floor(n / 2), box.right + gap + cw / 2)
    spots = Array.from({ length: n }, (_, i) => (i % 2 ? right : left)[Math.floor(i / 2)])
  } else if (Math.max(room.L, room.R) >= Math.min(need, 200 + gap)) {
    // one side has room: narrow the cards to fit it if needed (never below 200 px)
    cw = Math.min(cw, Math.max(room.L, room.R) - gap)
    spots = column(n, room.L >= room.R ? box.left - gap - cw / 2 : box.right + gap + cw / 2)
  } else {
    // a row above or below the device; work out how many cards fit per row in the free width
    // (beside the caption when the row would reach it), wrapping or narrowing before ever overlapping
    const plan = (below) => {
      for (const w of [cw, Math.max(200, cw - 40), 200]) {
        const lo = !capTop && below && box.bottom + gap + ch > H - reserve.h ? reserve.w + gap : pad
        const perRow = Math.max(1, Math.floor((W - pad - lo + 12) / (w + 12)))
        const rows = Math.ceil(n / perRow)
        if (rows * (ch + 10) - 10 + gap <= (below ? room.B : room.T)) return { below, w, lo, perRow }
      }
      return null
    }
    const p = plan(room.B >= room.T) || plan(room.B < room.T) || { below: room.B >= room.T, w: 200, lo: pad, perRow: n }
    cw = p.w
    spots = Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / p.perRow), inRow = Math.min(p.perRow, n - row * p.perRow), col = i % p.perRow
      const step = row * (ch + 10) + gap + ch / 2
      const mid = (p.lo + W - pad) / 2
      return {
        x: Math.min(W - pad - cw / 2, Math.max(p.lo + cw / 2, mid + (col - (inRow - 1) / 2) * (cw + 12))),
        y: clampY(p.below ? box.bottom + step : box.top - step),
      }
    })
  }
  const rect = (p) => ({ l: p.x - cw / 2, r: p.x + cw / 2, t: p.y - ch / 2, b: p.y + ch / 2 })
  const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b
  const dev = { l: box.left, r: box.right, t: box.top, b: box.bottom }
  const cap = capTop ? { l: 0, r: reserve.w, t: 0, b: reserve.h } : { l: 0, r: reserve.w, t: H - reserve.h, b: H }
  const rs = spots.map(rect)
  const clean = rs.every((a, i) => a.l >= 0 && a.r <= W && a.t >= 0 && a.b <= H && !hit(a, dev) && !hit(a, cap)
    && rs.every((b, j) => j <= i || !hit(a, b)))
  if (!clean) return null
  return Object.assign(spots, { device: box, origin: { x: (box.left + box.right) / 2, y: cy }, cw })
}
