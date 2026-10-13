import { FilePdf } from '@phosphor-icons/react'
import usePdfThumb from '../lib/usePdfThumb'
import { stops } from '../data/stops'

// A lab plate: a 1U-style faceplate whose window shows the real PDF's first page.
export default function LabCard({ lab, onOpen }) {
  const [canvasRef, state] = usePdfThumb(lab.file, 420)
  const stop = stops.find((s) => s.id === lab.device)
  const open = () => onOpen()

  return (
    <article
      className="lab-card"
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      role="button"
      tabIndex={0}
      aria-label={`Lab report: ${lab.title}. Open the PDF`}
    >
      <div className="lab-strip" aria-hidden="true">
        <span className="lab-strip__led" />
        <span>{stop ? stop.label : 'Lab'}</span>
        <span className="lab-strip__pdf"><FilePdf size={14} weight="duotone" />PDF</span>
      </div>
      <div className="pdf-thumb">
        <canvas ref={canvasRef} className={`thumb-canvas ${state === 'ready' ? 'is-ready' : ''}`} />
        {state !== 'ready' && (
          <div className="pdf-thumb-placeholder">
            <p>{state === 'error' ? 'Preview unavailable. Open to read.' : 'Loading preview'}</p>
          </div>
        )}
      </div>
      <div className="lab-body">
        <div className="lab-meta">
          <span className="lab-tag">{lab.tag}</span>
        </div>
        <h3 className="lab-title">{lab.title}</h3>
        <p className="lab-desc">{lab.desc}</p>
        <span className="view-btn">Read the lab report</span>
      </div>
    </article>
  )
}
