import { useCallback, useEffect, useRef, useState } from 'react'
import { loadPdf, renderPage } from '../lib/pdf'

const STEP = 0.15
const MIN = 0.4
const MAX = 3.0

export default function PdfModal({ lab, onClose }) {
  const [zoom, setZoom] = useState(1)
  const [pages, setPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const pagesRef = useRef(null)
  const pdfRef = useRef(null)

  // Esc to close.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Fit each page to the available column width (minus its padding), then
  // multiply by the user zoom. Recomputed on every render/resize so documents
  // always fit the window instead of a hard-coded width.
  const render = useCallback(async (scale) => {
    const pdf = pdfRef.current
    const host = pagesRef.current
    if (!pdf || !host) return
    const styles = getComputedStyle(host)
    const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
    const avail = Math.max(280, host.clientWidth - padX)
    const fitWidth = Math.min(1100, avail) // cap so it never gets unreadably huge
    host.innerHTML = ''
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n)
      const canvas = document.createElement('canvas')
      canvas.className = 'viewer__page'
      host.appendChild(canvas)
      const pageWidth = page.getViewport({ scale: 1 }).width
      await renderPage(page, canvas, (fitWidth / pageWidth) * scale)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const pdf = await loadPdf(lab.file)
      if (cancelled) return
      pdfRef.current = pdf
      setPages(pdf.numPages)
      await render(1)
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [lab.file, render])

  // Re-fit to width on viewport resize (debounced), keeping the current zoom.
  useEffect(() => {
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => { if (pdfRef.current) render(zoom) }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [render, zoom])

  const setZoomAndRender = (next) => {
    const clamped = Math.min(MAX, Math.max(MIN, next))
    setZoom(clamped)
    render(clamped)
  }

  return (
    <div className="viewer" onClick={onClose}>
      <div className="viewer__panel" onClick={(e) => e.stopPropagation()}>
        <div className="viewer__bar">
          <div className="viewer__meta">
            <span className="viewer__tag">DOC&gt;</span>
            <span className="viewer__name">{lab.title}</span>
            {pages > 0 && <span className="viewer__count viewer__pages-label">{pages}p</span>}
          </div>
          <div className="viewer__tools">
            <button onClick={() => setZoomAndRender(zoom - STEP)} aria-label="Zoom out">[ − ]</button>
            <span className="viewer__zoom">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoomAndRender(zoom + STEP)} aria-label="Zoom in">[ + ]</button>
            <a className="viewer__dl" href={encodeURI(lab.file)} download>DOWNLOAD</a>
            <button className="viewer__close" onClick={onClose} aria-label="Close">[ ESC ] CLOSE</button>
          </div>
        </div>
        <div className="viewer__scroll">
          {loading && <div className="viewer__loading">decoding document</div>}
          <div ref={pagesRef} className="viewer__pages" />
        </div>
      </div>
    </div>
  )
}
