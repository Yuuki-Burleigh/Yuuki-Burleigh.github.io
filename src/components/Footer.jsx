import { profile } from '../data/certs'

export default function Footer() {
  return (
    <footer>
      <div className="links">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/yuuki-burleigh</a>
        <a href={profile.github} target="_blank" rel="noreferrer">github.com/Yuuki-Burleigh</a>
      </div>
      <div className="sig">// end of transmission — yuuki burleigh</div>
    </footer>
  )
}
