import { useEffect, useRef, useState } from 'react'
import { signalChapters } from '../data/signal'
import '../styles/signal.css'

export function useReducedMotion() {
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduce(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduce
}

export default function SignalPath({ onOpen }) {
  const root = useRef(null)
  const canvas = useRef(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const section = root.current
    const articles = [...section.querySelectorAll('article')]
    let raf = 0, disposed = false, lastGood = null, lastChapter = -1
    const frames = new Map()
    const loaded = new Set()
    const step = window.innerWidth <= 768 || navigator.connection?.saveData ? 2 : 1
    const context = reduce ? null : canvas.current.getContext('2d')
    const schedule = () => { if (!disposed && !raf) raf = requestAnimationFrame(draw) }
    const loadChapter = index => {
      if (reduce || index > 4 || loaded.has(index)) return
      loaded.add(index)
      for (let frame = 0; frame < 145; frame += step) {
        const img = new Image()
        frames.set(`${index}:${frame}`, img)
        img.onload = schedule
        img.onerror = () => { frames.delete(`${index}:${frame}`) }
        // AVIF: half the bytes of WebP at matched quality (measured 12.5 MB vs 26.3 MB); a browser without AVIF keeps the chapter poster.
        img.src = `media/signal/ch${index + 1}/f${String(frame + 1).padStart(3, '0')}.avif`
      }
    }
    function draw() {
      raf = 0
      if (disposed) return
      const top = section.getBoundingClientRect().top
      const span = window.innerHeight * 1.6
      const position = Math.max(0, Math.min(4.999999, -top / span))
      const chapter = Math.floor(position)
      const progress = position - chapter
      articles.forEach((article, index) => {
        article.dataset.active = String(index === chapter)
        const meter = article.querySelector('progress')
        meter.value = index < chapter ? 1 : index === chapter ? progress : 0
      })
      if (reduce || !context) return
      // Retain only the current and next chapter's images as the visitor moves on.
      for (const cached of loaded) {
        if (cached !== chapter && cached !== chapter + 1) {
          for (let frame = 0; frame < 145; frame += step) {
            const key = `${cached}:${frame}`
            const image = frames.get(key)
            if (image) { image.onload = null; image.onerror = null }
            frames.delete(key)
          }
          loaded.delete(cached)
        }
      }
      loadChapter(chapter)
      if (top <= 0) loadChapter(chapter + 1)
      const frame = Math.min(144, Math.round(Math.round(progress * 144) / step) * step)
      const img = frames.get(`${chapter}:${frame}`)
      if (img?.complete && img.naturalWidth) { lastGood = img; lastChapter = chapter }
      const stage = canvas.current.parentElement
      if (lastChapter !== chapter && stage.dataset.poster !== String(chapter)) {
        // A jump (nav link, ?solo) lands before this chapter's frames arrive: show its own poster, never the previous chapter.
        stage.dataset.poster = String(chapter)
        stage.style.backgroundImage = `url('${signalChapters[chapter].poster}')`
      }
      canvas.current.style.opacity = lastChapter === chapter ? '1' : '0'
      if (lastChapter !== chapter) return
      if (!lastGood) return
      const el = canvas.current
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(el.clientWidth * dpr), height = Math.round(el.clientHeight * dpr)
      if (el.width !== width || el.height !== height) { el.width = width; el.height = height }
      const scale = Math.max(width / lastGood.naturalWidth, height / lastGood.naturalHeight)
      const w = lastGood.naturalWidth * scale, h = lastGood.naturalHeight * scale
      // Portrait screens crop the 16:9 film: the plates put the subject right of centre, so bias the crop there.
      const fx = width < height ? .68 : .5
      context.drawImage(lastGood, (width - w) * fx, (height - h) / 2, w, h)
      el.dataset.frame = lastGood.src.split('/').slice(-2).join('/')
    }
    const solo = /^ch([1-5]):(0(?:\.\d+)?|1(?:\.0+)?)$/.exec(new URLSearchParams(location.search).get('solo') || '')
    const jump = () => {
      if (!solo) return
      const index = Number(solo[1]) - 1
      const y = reduce ? articles[index].getBoundingClientRect().top + window.scrollY : section.getBoundingClientRect().top + window.scrollY + (index + Math.min(Number(solo[2]), .999999)) * window.innerHeight * 1.6
      window.scrollTo({ top: y, behavior: 'instant' })
      schedule()
    }
    loadChapter(0)
    jump()
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('load', jump)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('load', jump)
      frames.forEach(img => { img.onload = null; img.onerror = null })
      frames.clear()
    }
  }, [reduce])

  return <section id="signal-path" aria-label="Signal path" ref={root} className={`signal-path${reduce ? ' signal-path--still' : ''}`}>
    {!reduce && <div className="signal-stage" style={{ backgroundImage: "url('media/signal/plate.webp')" }}><canvas ref={canvas} aria-hidden="true" /></div>}
    <div className="signal-chapters">
      {signalChapters.map((chapter, index) => <article key={chapter.id} id={chapter.id} className="signal-chapter">
        {reduce && <img className="signal-poster" src={chapter.poster} alt={`Amber electrical signal through ${chapter.device.toLowerCase()}`} loading="lazy" />}
        <div className="signal-hud" onFocusCapture={() => {
          if (reduce || root.current.querySelectorAll('article')[index].dataset.active === 'true') return
          window.scrollTo({ top: root.current.getBoundingClientRect().top + window.scrollY + index * window.innerHeight * 1.6, behavior: 'instant' })
        }}>
          <div className="signal-readout"><span>HOP 0{index + 1}/05</span><span>OSI · {chapter.layer}</span></div>
          <h2>{chapter.device}</h2>
          <p>{chapter.description}</p>
          <progress max="1" value="0" aria-label={`${chapter.device} chapter progress`} />
          <div className="signal-labs">{chapter.labs.map(lab => <button key={lab.file} onClick={() => onOpen(lab)}>{lab.title}<span aria-hidden="true">↗</span></button>)}</div>
        </div>
      </article>)}
    </div>
  </section>
}
