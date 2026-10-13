import { useEffect, useState } from 'react'
import { stops, plate } from '../data/homelab'
import { profile } from '../data/certs'
import { LabRows } from '../App'
import { labs } from '../data/labs'

export default function HomeLab({ onOpen }) {
  const [current, setCurrent] = useState(0)
  const [drawer, setDrawer] = useState(false)
  const [chosen, setChosen] = useState(false)
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const playing = !reduced && !chosen && !hover && !focus
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setCurrent((value) => (value + 1) % stops.length), 4500)
    return () => clearInterval(timer)
  }, [playing])
  const select = (index) => {
    setCurrent((index + stops.length) % stops.length)
    setChosen(true)
    setDrawer(true)
  }
  const stop = stops[current]
  const previous = stops[(current + stops.length - 1) % stops.length]
  const next = stops[(current + 1) % stops.length]
  const points = stop.path.map((point) => `${point.x},${point.y * 0.5625}`).join(' ')
  return (
    <div className={`home-lab${chosen ? ' user-selected' : ''}`} data-motion={playing ? 'play' : 'still'}>
      <section
        className="hero"
        aria-label="Explore my home lab"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setFocus(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            select(current + (event.key === 'ArrowRight' ? 1 : -1))
          }
        }}
      >
        <div className="hero-copy">
          <p className="running-head">
            {current < 3 ? 'Rack' : 'Lab'}: {stop.name} to {next.name}
          </p>
          <h1>
            Yuuki <br />
            Burleigh
          </h1>
          <p className="profession">Network &amp; Cloud Professional</p>
          <p className="hero-summary">
            I document the network labs I build. Pick a device to open its lab reports.
          </p>
          <a className="primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
        </div>
        <div className={`plate-window${reduced ? ' reduced' : ''}`}>
          <div
            className="plate-camera"
            style={{
              '--anchor-x': `${stop.anchor.x}%`,
              '--anchor-y': `${stop.anchor.y}%`,
              '--pan-x': `${(65 - stop.anchor.x) * 0.38}%`,
              '--pan-y': `${(45 - stop.anchor.y) * 0.25}%`,
            }}
          >
            <img
              className="lab-plate"
              src={plate.sources[1].src}
              srcSet={plate.sources.map((source) => `${source.src} ${source.w}w`).join(', ')}
              sizes="(max-width: 600px) 960px, 100vw"
              width={plate.width}
              height={plate.height}
              alt={plate.alt}
              fetchpriority="high"
            />
            <svg className="packet-overlay" viewBox="0 0 100 56.25" aria-hidden="true" key={stop.id}>
              {points ? (
                <polyline className="packet-path" points={points} pathLength="100" />
              ) : (
                <>
                  <circle className="packet-arrival" cx={stop.anchor.x} cy={stop.anchor.y * 0.5625} r=".55" />
                  {stop.hop && (
                    <circle
                      className="packet-departure"
                      cx={previous.anchor.x}
                      cy={previous.anchor.y * 0.5625}
                      r=".55"
                    />
                  )}
                </>
              )}
            </svg>
            {drawer && (
              <LabPopout key={stop.id} stop={stop} onOpen={onOpen} />
            )}
            {stops.map((device, index) => (
              // Mouse shortcut onto the plate; the stepper below is the keyboard and screen-reader control.
              <span
                key={device.id}
                className={`tape plate-label${index === current ? ' active' : ''}${device.hint ? ' endpoint' : ''}`}
                style={{ left: `${(device.label ?? device.anchor).x}%`, top: `${(device.label ?? device.anchor).y}%` }}
                aria-hidden="true"
                onClick={() => select(index)}
              >
                {device.name}
                {device.hint && <small>{device.hint}</small>}
              </span>
            ))}
          </div>
        </div>
        {/* The six device tapes are the hero's navigation, not competing calls to action: "Email me" is the
            only CTA. A page measuring tool counts each tape as a CTA above the fold (text-only reference sites
            score 0); that difference is the design, a device picker, not clutter. */}
        <div className="stepper">
          <button className="step-arrow" aria-label="Previous device" onClick={() => select(current - 1)}>
            ←
          </button>
          <div className="device-steps">
            {stops.map((device, index) => (
              <button
                className={`tape ${index === current ? 'active' : ''}`}
                key={device.id}
                aria-current={index === current ? 'step' : undefined}
                aria-expanded={drawer && index === current}
                aria-controls="lab-drawer"
                onClick={() => select(index)}
              >
                {device.name}
                <small>
                  {device.labs.length} {device.labs.length === 1 ? 'lab' : 'labs'}
                </small>
              </button>
            ))}
          </div>
          <button className="step-arrow" aria-label="Next device" onClick={() => select(current + 1)}>
            →
          </button>
        </div>
      </section>
      {drawer && (
        <section id="lab-drawer" className="lab-drawer" aria-label={`${stop.name} labs`}>
          <div className="drawer-inner">
            <div className="drawer-heading">
              <h2 className="tape active">{stop.name}</h2>
              <button onClick={() => setDrawer(false)}>Close labs ×</button>
            </div>
            <LabRows stop={stop} onOpen={onOpen} />
          </div>
        </section>
      )}
    </div>
  )
}

// The selected device's lab reports eject from its tape: each card feeds out of the label like
// label-maker tape, then fans away from the nearest edge of the frame so it stays in view.
function LabPopout({ stop, onOpen }) {
  const at = stop.label ?? stop.anchor
  const dirX = at.x > 55 ? -1 : 1
  const dirY = at.y < 30 ? 1 : -1
  return (
    <div className="lab-popout" style={{ left: `${at.x}%`, top: `${at.y}%`, '--dir-x': dirX, '--dir-y': dirY }}>
      {stop.labs.map((title, i) => {
        const lab = labs.find((item) => item.title === title)
        return (
          <button
            key={title}
            className="popout-card"
            style={{ '--i': i, '--ci': i - (stop.labs.length - 1) / 2 }}
            onClick={() => onOpen(lab)}
            aria-label={`Open lab report: ${title}`}
          >
            <img src={lab.thumb} alt="" width="120" height="155" />
            <span>{title}</span>
          </button>
        )
      })}
    </div>
  )
}
