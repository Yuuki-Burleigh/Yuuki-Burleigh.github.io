import { useState } from 'react'
import { labs } from '../data/labs'
import LabCard from './LabCard'
import PdfModal from './PdfModal'
import Reveal from './Reveal'

export default function Labs() {
  const [filter, setFilter] = useState('All')
  const tags = ['All', ...new Set(labs.map(lab => lab.tag))]
  const [open, setOpen] = useState(null)
  const count = String(labs.length).padStart(2, '0')

  return (
    <section id="work">
      <div className="section-header">
        <h2 className="section-title">
          <span className="slash">//</span> Lab Documentation
          <span className="count">[ {count} ]</span>
        </h2>
        <div className="rule" />
      </div>

      <div className="lab-filters" role="group" aria-label="Filter labs by topic">
        {tags.map(tag => <button key={tag} aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}</button>)}
      </div>
      <div className="grid lab-grid">
        {labs.map((lab, i) => (filter === 'All' || filter === lab.tag) && (
          <Reveal key={lab.file} delay={(i % 3) * 0.06}>
            <LabCard lab={lab} index={i} onOpen={setOpen} />
          </Reveal>
        ))}
      </div>

      {open !== null && <PdfModal lab={labs[open]} onClose={() => setOpen(null)} />}
    </section>
  )
}
