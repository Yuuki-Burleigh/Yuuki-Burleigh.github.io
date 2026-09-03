import { useEffect, useRef, useState } from 'react'
import { loadPdf, renderPage } from '../lib/pdf'

// Console "case file": the lab's real PDF first page is the card image
// (amber-washed, hover scanline), with animated corner brackets.
export default function LabCard({ lab, index, onOpen }) {
  const canvasRef = useRef(null)
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const pdf = await loadPdf(lab.file)
        if (cancelled) return
        const page = await pdf.getPage(1)
        if (cancelled || !canvasRef.current) return
        const base = page.getViewport({ scale: 1 })
        await renderPage(page, canvasRef.current, 420 / base.width)
        if (!cancelled) setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    })()
    return () => { cancelled = true }
  }, [lab.file])

  const open = () => onOpen(index)
  const idx = String(index + 1).padStart(2, '0')

  return (
    <article
      className="lab-card"
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      role="button"
      tabIndex={0}
      aria-label={`Open document: ${lab.title}`}
    >
      <div className="pdf-thumb">
        <canvas ref={canvasRef} className={`thumb-canvas ${state === 'ready' ? 'is-ready' : ''}`} />
        <div className="scanline" />
        {state !== 'ready' && (
          <div className="pdf-thumb-placeholder">
            <svg width="40" height="48" viewBox="0 0 36 44">
              <rect x="1" y="1" width="34" height="42" rx="3" stroke="#ffaa3c" strokeWidth="1.2" fill="none" />
              <path d="M9 12h18M9 20h18M9 28h12" stroke="#ffaa3c" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p>{state === 'error' ? 'load error' : 'decoding'}</p>
          </div>
        )}
      </div>
      <div className="lab-body">
        <div className="lab-meta">
          <span className="lab-index">{idx}</span>
          <span className="lab-tag">{lab.tag}</span>
        </div>
        <h3 className="lab-title">{lab.title}</h3>
        <p className="lab-desc">{lab.desc}</p>
        <button className="view-btn" onClick={(e) => { e.stopPropagation(); open() }}>
          access_file →
        </button>
      </div>
    </article>
  )
}
