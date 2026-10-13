import { useEffect, useState } from 'react'
import { Briefcase, Flask, Certificate, Sun, Moon } from '@phosphor-icons/react'

// Theme choice is a per-visitor convenience: storage can be blocked, so every access is guarded.
const readTheme = () => {
  try { return localStorage.getItem('theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
}

export default function Rail() {
  const [theme, setTheme] = useState(readTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* storage blocked: theme still applies */ }
  }, [theme])
  const light = theme === 'light'

  return (
    <header className="rail unit unit--1u">
      <span className="rail__leds" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="vent" aria-hidden="true" />
      <nav aria-label="Sections" className="rail__nav">
        <a href="#experience"><span className="nav__led" aria-hidden="true" /><Briefcase size={15} weight="duotone" aria-hidden="true" />Experience</a>
        <a href="#work"><span className="nav__led" aria-hidden="true" /><Flask size={15} weight="duotone" aria-hidden="true" />Labs</a>
        <a href="#certs"><span className="nav__led" aria-hidden="true" /><Certificate size={15} weight="duotone" aria-hidden="true" />Certifications</a>
      </nav>
      <button
        type="button"
        role="switch"
        aria-checked={light}
        aria-label="Light mode"
        className="rocker"
        onClick={() => setTheme(light ? 'dark' : 'light')}
      >
        <Moon className="rocker__label" size={15} weight="fill" aria-hidden="true" />
        <span className="rocker__body" aria-hidden="true"><span className="rocker__paddle" /></span>
        <Sun className="rocker__label" size={15} weight="fill" aria-hidden="true" />
      </button>
    </header>
  )
}
