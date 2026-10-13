import { profile } from '../data/certs'
export default function Footer() {
  return <footer id="contact" className="content-section"><p>Let’s keep something important running.</p><a className="contact-email" href={`mailto:${profile.email}`}>Email me</a><div className="footer-links"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><span>Yuuki Burleigh</span></div></footer>
}
