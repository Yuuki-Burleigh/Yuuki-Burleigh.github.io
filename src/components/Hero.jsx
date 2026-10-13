import { useEffect, useRef, useState } from 'react'
import { plate, stops } from '../data/homelab'
import { labs } from '../data/labs'
import { profile } from '../data/certs'

export default function Hero({ onOpen }) {
  const windowRef = useRef(null)
  const [frame, setFrame] = useState({ width: 1280, height: 584 })
  useEffect(() => {
    const update = () => {
      const rect = windowRef.current.getBoundingClientRect()
      if (rect.width) setFrame({ width: rect.width, height: rect.height })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(windowRef.current)
    return () => observer.disconnect()
  }, [])
  const [current, setCurrent] = useState(0)
  const [drawer, setDrawer] = useState(false)
  const [chosen, setChosen] = useState(false)
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const stop = stops[current]
  const phone = frame.width <= 700
  const cameraWidth = frame.width * (phone ? 4 : 1.35)
  const cameraHeight = cameraWidth * 9 / 16
  const cameraX = Math.min(0, Math.max(frame.width - cameraWidth, frame.width * (phone ? .5 : .57) - cameraWidth * stop.anchor.x / 100))
  const cameraY = Math.min(0, Math.max(frame.height - cameraHeight, frame.height * (phone ? .32 : .42) - cameraHeight * stop.anchor.y / 100))
  const playing = !reduce && !chosen && !hover && !focus
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduce(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % stops.length), 4500)
    return () => clearInterval(timer)
  }, [playing])
  const select = (i, open = true) => {
    setChosen(true)
    setCurrent((i + stops.length) % stops.length)
    setDrawer(open)
  }
  const previous = stops[(current + stops.length - 1) % stops.length]
  const path = stop.path.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y * .5625}`).join(' ')
  return (
    <section className="hero" id="top" data-motion={playing ? 'play' : 'still'} data-reduced={reduce} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setFocus(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false) }} onKeyDown={e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(current + (e.key === 'ArrowRight' ? 1 : -1), drawer) }
      if (e.key === 'Escape') setDrawer(false)
    }}>
      <div className="hero-copy">
        <p className="running-head">{current < 3 ? 'Rack' : 'Home lab'}: {stop.name} to {stops[(current + 1) % stops.length].name}</p>
        <h1>Yuuki<br />Burleigh</h1>
        <p className="hero-title">{profile.title}</p>
        <p>I build networks, secure connections, and document what works in my home lab.</p>
        <a className="primary" href={`mailto:${profile.email}`}>Email me</a>
      </div>
      <div className="plate-window" ref={windowRef}>
        <div className="plate-camera" style={reduce ? undefined : { width: cameraWidth, transform: `translate(${cameraX}px, ${cameraY}px)` }}>
          <img src={plate.sources[0].src} srcSet={plate.sources.map(s => `${s.src} ${s.w}w`).join(', ')} sizes="(max-width: 700px) 960px, 100vw" width={plate.width} height={plate.height} alt={plate.alt} fetchpriority="high" />
          <svg className="packet" viewBox="0 0 100 56.25" aria-hidden="true" key={stop.id}>
            {path ? <path className="packet-path" d={path} pathLength="100" /> : <>
              {stop.hop && <circle className="hop-out" cx={previous.anchor.x} cy={previous.anchor.y * .5625} r=".45" />}
              <circle className="hop-in" cx={stop.anchor.x} cy={stop.anchor.y * .5625} r=".45" />
            </>}
          </svg>
          {stops.map((s, i) => <button key={s.id} className={`device-label tape ${i === current ? 'active' : ''}`} style={{ left: `${s.anchor.x}%`, top: `${s.anchor.y}%` }} tabIndex={reduce || i === current ? 0 : -1} aria-hidden={!reduce && i !== current} aria-label={`Explore ${s.name}`} onClick={() => select(i)}>{s.name}</button>)}
        </div>
        {drawer && <section className="lab-drawer" role="region" aria-label={`${stop.name} labs`}>
          <div className="drawer-head"><h2 className="tape active">{stop.name} labs</h2><button aria-label="Close lab drawer" onClick={() => setDrawer(false)}>Close</button></div>
          {stop.labs.map(title => <button className="drawer-lab" key={title} onClick={() => onOpen(labs.find(l => l.title === title))}>{title}<span aria-hidden="true">↗</span></button>)}
        </section>}
      </div>
      <div className="stepper" aria-label="Lab devices">
        <button className="step-arrow" aria-label="Previous device" onClick={() => select(current - 1, drawer)}>←</button>
        <div className="device-steps">{stops.map((s, i) => <button className={`tape ${i === current ? 'active' : ''}`} key={s.id} aria-current={i === current ? 'step' : undefined} onClick={() => select(i)}><span>{s.name}</span><small>{s.labs.length} {s.labs.length === 1 ? 'lab' : 'labs'}</small></button>)}</div>
        <button className="step-arrow" aria-label="Next device" onClick={() => select(current + 1, drawer)}>→</button>
      </div>
    </section>
  )
}
