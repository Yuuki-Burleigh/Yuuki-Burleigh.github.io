import { useState, useCallback, useEffect } from 'react'
import PdfModal from './components/PdfModal'
import HomeLab from './components/HomeLab'
import Experience from './components/Experience'
import { stops } from './data/homelab'
import { labs, skills } from './data/labs'
import { certs, profile } from './data/certs'

export function LabRows({ stop, onOpen, skill = null }) {
  return (
    <div className="lab-rows">
      {stop.labs.map((title) => {
        const lab = labs.find((item) => item.title === title)
        return (
          <button
            className="lab-row"
            key={title}
            onClick={() => onOpen(lab)}
            data-match={skill ? String(lab.skills.includes(skill)) : undefined}
          >
            <img className="lab-thumb" src={lab.thumb} alt="" width="96" height="124" loading="lazy" />
            <span className="lab-text">
              <strong>{title}</strong>
              <span className="lab-summary">
                <span className="lab-problem"><span className="lab-key">Problem</span> {lab.problem}</span>
                <span className="lab-did"><span className="lab-key">What I did</span> {lab.did}</span>
              </span>
            </span>
            <span className="file-label">PDF ↗</span>
          </button>
        )
      })}
    </div>
  )
}

function SkillFilter({ skill, onChange }) {
  return (
    <div className="skill-filter" role="group" aria-label="Filter by skill">
      {skills.map((name) => {
        const count = labs.filter((lab) => lab.skills.includes(name)).length
        return (
          <button
            key={name}
            className="skill-chip"
            aria-pressed={skill === name}
            onClick={() => onChange(skill === name ? null : name)}
          >
            {name}
            <small>{count}</small>
          </button>
        )
      })}
    </div>
  )
}

export default function App() {
  const [open, setOpen] = useState(null)
  const [skill, setSkill] = useState(null)
  const [light, setLight] = useState(false)
  const close = useCallback(() => setOpen(null), [])
  useEffect(() => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark'
  }, [light])
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="signature" href="#content">
          YB<span> / Home lab</span>
        </a>
        <nav aria-label="Main">
          <a href="#work">Labs</a>
          <a href="#certs">Certifications</a>
          <a href="#experience">Experience</a>
        </nav>
        <div className="header-links">
          {certs.map((cert) => (
            <a key={cert.name} href={cert.verify} target="_blank" rel="noreferrer" aria-label={`Verify ${cert.name}`}>
              {cert.short} ↗
            </a>
          ))}
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a className="header-cta" href={`mailto:${profile.email}`}>
            Email me
          </a>
        </div>
        <button
          className="theme-toggle"
          aria-label="Light mode"
          aria-pressed={light}
          onClick={() => setLight(!light)}
        >
          {light ? 'Evening' : 'Daylight'}
        </button>
      </header>
      <main id="content" tabIndex={-1}>
        <HomeLab onOpen={setOpen} skill={skill} />
        <section id="certs" className="section cert-band">
          <h2 className="cert-band-title">Certifications</h2>
          <div className="credentials">
            {certs.map((cert) => (
              <article className="credential" key={cert.name}>
                <img src={cert.badge} alt={`${cert.issuer} logo`} width="64" height="64" />
                <h3>{cert.name}</h3>
                <p>{cert.issuer}</p>
                <a href={cert.verify} target="_blank" rel="noreferrer">
                  Verify credential ↗
                </a>
              </article>
            ))}
          </div>
        </section>
        <section id="work" className="section lab-index">
          <div className="section-intro">
            <h2>
              Lab reports by device
            </h2>
            <p>
              Pick a skill from a job description to see which labs prove it. Each PDF includes
              configurations, screenshots, and proof of functionality.
            </p>
          </div>
          <SkillFilter skill={skill} onChange={setSkill} />
          {stops.map((stop, index) => (
            <div
              role="group"
              aria-label={stop.name}
              className="device-group"
              key={stop.id}
              data-match={
                skill
                  ? String(stop.labs.some((title) => labs.find((lab) => lab.title === title).skills.includes(skill)))
                  : undefined
              }
            >
              <h3>
                <span className="device-number">0{index + 1}</span>
                <span className="tape">{stop.name}</span>
                <small>
                  {stop.labs.length} {stop.labs.length === 1 ? 'lab' : 'labs'}
                </small>
              </h3>
              <LabRows stop={stop} onOpen={setOpen} skill={skill} />
            </div>
          ))}
        </section>
        <Experience />
        <footer className="section contact" id="contact">
          <h2>Let’s talk networks.</h2>
          <a className="email-large" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <div className="contact-bottom">
            <span>Yuuki Burleigh</span>
            <div>
              <a href={profile.linkedin}>LinkedIn ↗</a>
              <a href={profile.github}>GitHub ↗</a>
            </div>
          </div>
        </footer>
      </main>
      {open && <PdfModal lab={open} onClose={close} />}
    </>
  )
}
