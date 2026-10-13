import { useCallback, useEffect, useRef, useState } from 'react'
import { Network, ArrowsSplit, ShieldCheck, LockKey, Cloud, Cpu, FilePdf, Pause, Play, ArrowRight } from '@phosphor-icons/react'
import { stops, film, labsFor, placeCards, stopAt } from '../data/stops'
import { labs as allLabs } from '../data/labs'
import usePdfThumb from '../lib/usePdfThumb'

// The hero film: one continuous take that follows the packet along the wire, cable -> switch -> router -> firewall
// -> VPN uplink -> cloud data centre -> GPU server, then loops. Nothing ever freezes: while the camera passes a
// device, the lab reports written for it come out beside it. The reports are DOM read from labs.js, so a new lab
// never needs a new render.
const ICONS = { switch: Network, router: ArrowsSplit, firewall: ShieldCheck, vpn: LockKey, cloud: Cloud, ai: Cpu }
const CARD = { cw: 264, ch: 96, reserve: { w: 410, h: 120 } }   // reserve: the caption, bottom-left
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const reportCount = (n) => `${n} lab report${n === 1 ? '' : 's'}`
const nextStop = (t) => stops.find((s) => s.t0 > t) || stops[0]

function ReportCard({ lab, onOpen, style }) {
  const [thumb, state] = usePdfThumb(lab.file, 46)
  return (
    <li style={style}>
      <button type="button" className="chip" onClick={onOpen} aria-label={`Lab report: ${lab.title}. Open the PDF`}>
        <span className={`chip__page${state === 'ready' ? ' is-ready' : ''}`} aria-hidden="true">
          <canvas ref={thumb} className="chip__thumb" />
          <FilePdf className="chip__pdf" size={18} weight="duotone" />
        </span>
        <span className="chip__body">
          <span className="chip__tag">Lab report · {lab.tag}</span>
          <span className="chip__title">{lab.title}</span>
          <span className="chip__open">Open PDF <ArrowRight size={12} weight="bold" aria-hidden="true" /></span>
        </span>
      </button>
    </li>
  )
}

export default function PacketPath({ onOpen }) {
  const [reduce] = useState(reducedMotion)
  const [active, setActive] = useState(reduce ? stops[0] : null)   // the stop the camera is passing, or null
  const [upcoming, setUpcoming] = useState(stops[0])
  const [playing, setPlaying] = useState(!reduce)
  const [visible, setVisible] = useState(true)
  const [size, setSize] = useState(null)                  // window px, for placing cards beside the device
  const video = useRef(null)
  const unit = useRef(null)
  const win = useRef(null)
  const running = playing && visible

  // Pause the film whenever the hero is off screen.
  useEffect(() => {
    if (!unit.current || !window.IntersectionObserver) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(unit.current)
    return () => io.disconnect()
  }, [])

  // Track the film window size (desktop only; at 768 px and below the cards always list under the film).
  useEffect(() => {
    if (!win.current || !window.ResizeObserver) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      setSize(window.innerWidth > 768 ? { W: width, H: height } : null)
    })
    ro.observe(win.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (running) v.play()?.catch(() => setPlaying(false))
    else v.pause()
  }, [running])

  // Which device is on screen: updated from the film's own clock, only when it changes.
  const onTime = useCallback(() => {
    const t = video.current?.currentTime || 0
    const s = stopAt(t)
    setActive((a) => (a === s ? a : s))
    if (!s) setUpcoming((u) => { const n = nextStop(t); return u === n ? u : n })
  }, [])

  const goTo = (i) => {
    const s = stops[i]
    if (video.current) video.current.currentTime = s.t0
    setActive(s)
    if (!reduce) setPlaying(true)
  }
  const toggle = () => setPlaying((p) => !p)

  const current = active || upcoming
  const labs = active ? labsFor(active.id) : []
  // Place cards beside the device only if every stop's reports fit cleanly at this window size; otherwise every
  // stop lists them under the film, so the layout does not change from stop to stop.
  const placeable = size && stops.every((s) => placeCards(s, labsFor(s.id).length, size.W, size.H, CARD))
  const spots = active && placeable ? placeCards(active, labs.length, size.W, size.H, CARD) : null
  const spotStyle = (i) => spots && {
    '--x': `${spots[i].x}px`, '--y': `${spots[i].y}px`,
    '--ox': `${spots.origin.x}px`, '--oy': `${spots.origin.y}px`, '--d': `${i * 160}ms`, '--cw': `${spots.cw}px`,
  }

  return (
    <section className="path unit" ref={unit} aria-label="Packet path">
      <header className="path__head">
        <div>
          <h2 className="path__title">See my labs</h2>
          <p className="path__lede">Follow the packet through the network. At each device, the lab reports I wrote for it come out. Open one to read the full PDF.</p>
        </div>
        <a className="path__all" href="#work">All {allLabs.length} lab reports <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
      </header>

      <div className={`path__window${active ? ' is-holding' : ''}${size && !placeable ? ' is-docked' : ''}`} ref={win}>
        {!reduce && (
          <video
            ref={video}
            className="path__film is-front"
            src={film.src}
            poster={film.poster}
            muted
            loop
            playsInline
            preload="auto"
            onTimeUpdate={onTime}
            aria-hidden="true"
          />
        )}
        {reduce && (
          <img key={`still-${current.id}`} className="path__still" src={current.poster} alt={`${current.label}: ${current.does}`} />
        )}

        <div className={`path__caption${current.caption === 'top' ? ' is-top' : ''}`} aria-live="polite">
          {active ? (
            <>
              <span className="path__layer">{current.layer} · {reportCount(labsFor(current.id).length)}</span>
              <span className="path__device">{current.label}</span>
              <span className="path__does">{current.does}</span>
            </>
          ) : (
            <>
              <span className="path__layer">Next stop</span>
              <span className="path__device">{upcoming.label}</span>
              <span className="path__does">{reportCount(labsFor(upcoming.id).length)}</span>
            </>
          )}
        </div>

        <div className={`path__dock${spots ? ' is-placed' : ''}`}>
          {!active && (
            <p className="path__transit">{`Packet in transit to the ${upcoming.label.toLowerCase()}`}</p>
          )}
          {active && (
            <ul className="path__labs" key={`labs-${active.id}`} aria-label={`${active.label} lab reports`}>
              {labs.map((lab, i) => (
                <ReportCard key={lab.file} lab={lab} style={spotStyle(i)} onOpen={() => { setPlaying(false); onOpen(lab) }} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="path__controls">
        {!reduce && (
          <button type="button" className="path__play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
          </button>
        )}
        <ol className="stops" aria-label="Stops">
          {stops.map((s, i) => {
            const Icon = ICONS[s.id]
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`stop${stops.indexOf(current) > i ? ' is-passed' : ''}`}
                  aria-current={current === s ? 'step' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="stop__led" aria-hidden="true" />
                  <Icon size={16} weight="duotone" aria-hidden="true" />
                  {s.label}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
