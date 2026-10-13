import { useState } from 'react'
import { labs } from '../data/labs'
import { stops } from '../data/stops'
import LabCard from './LabCard'

// Filter by the same device stops the hero film visits.
export default function Labs({ onOpen }) {
  const [filter, setFilter] = useState('all')
  const shown = labs.filter((lab) => filter === 'all' || lab.device === filter)

  return (
    <section id="work" className="unit section" aria-labelledby="work-title">
      <div className="section__head">
        <h2 id="work-title" className="section__title">Lab reports</h2>
        <p className="section__note">{labs.length} write-ups with configurations and proof of functionality. Open any to read the full PDF.</p>
      </div>

      <div className="lab-filters" role="group" aria-label="Filter labs by device">
        <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
        {stops.map((s) => (
          <button key={s.id} type="button" aria-pressed={filter === s.id} onClick={() => setFilter(s.id)}>{s.label}</button>
        ))}
      </div>
      <div className="lab-grid">
        {shown.map((lab) => (
          <LabCard key={lab.file} lab={lab} onOpen={() => onOpen(lab)} />
        ))}
      </div>
    </section>
  )
}
