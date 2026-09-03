import { useState } from 'react'
import { labs } from '../data/labs'
import LabCard from './LabCard'
import PdfModal from './PdfModal'
import Reveal from './Reveal'

export default function Labs() {
  const [open, setOpen] = useState(null)
  const count = String(labs.length).padStart(2, '0')

  return (
    <section id="work">
      <div className="section-header">
        <div className="section-title">
          <span className="slash">//</span> Lab Documentation
          <span className="count">[ {count} ]</span>
        </div>
        <div className="rule" />
      </div>

      <div className="grid">
        {labs.map((lab, i) => (
          <Reveal key={lab.file} delay={(i % 3) * 0.06}>
            <LabCard lab={lab} index={i} onOpen={setOpen} />
          </Reveal>
        ))}
      </div>

      {open !== null && <PdfModal lab={labs[open]} onClose={() => setOpen(null)} />}
    </section>
  )
}
