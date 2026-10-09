import { profile } from '../data/certs'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="identity-mark" aria-hidden="true">YB<span>＋</span></div>
      <h1 className="hero-name">{profile.first}<br />{profile.last}</h1>
      <p className="hero-title">{profile.title}</p>
      <p className="hero-summary">Documented labs across routing, switching, firewalls, security, and AWS cloud.</p>
      <div className="hero-links">
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </header>
  )
}
