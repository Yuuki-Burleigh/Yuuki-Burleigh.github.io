import { useEffect, useState } from 'react'
import { profile } from '../data/certs'

export default function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <a className="nav__brand" href="#top">
        <span className="nav__mark">Y</span>
        <span className="nav__name mono">{profile.first} {profile.last}</span>
      </a>
      <nav className="nav__links mono">
        <a href="#work">Work</a>
        <a href="#certs">Credentials</a>
        <a className="btn btn--sm" href="#contact">Contact</a>
      </nav>
    </header>
  )
}
