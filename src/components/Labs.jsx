import { stops } from '../data/homelab'
import { labs } from '../data/labs'
export default function Labs({ onOpen }) {
  return <section id="work" className="content-section"><div className="section-heading"><h2>Inside the lab</h2><p>Pick a device. Read the configuration, then the proof.</p></div><div className="lab-index">{stops.map(stop => <div className="lab-group" role="group" aria-label={stop.name} key={stop.id}><h3><span className="tape">{stop.name}</span></h3><div>{stop.labs.map(title => { const lab = labs.find(l => l.title === title); return <button className="lab-row" key={title} onClick={() => onOpen(lab)}><span className="lab-title">{title}<span aria-hidden="true">↗</span></span><span className="lab-desc">{lab.desc}</span></button> })}</div></div>)}</div></section>
}
