import { profile } from '../data/certs'

export default function Footer() {
  return (
    <footer className="unit unit--1u footer">
      <span className="footer__name">{profile.first} {profile.last}</span>
      <div className="footer__links">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  )
}
