import { profile } from '../data/certs'
import Reveal from './Reveal'

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__media">
        <img src="/media/img/fiber.jpg" alt="" aria-hidden="true" />
        <div className="contact__scrim" />
      </div>
      <Reveal className="contact__inner">
        <span className="section__kicker mono">03 / Get in touch</span>
        <h2 className="contact__title">Let’s keep something important running.</h2>
        <p className="contact__sub">
          Open to network, security, and cloud roles. The fastest way to reach me is email.
        </p>
        <a className="btn btn--primary btn--lg" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="contact__links mono">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn →</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub →</a>
        </div>
      </Reveal>
      <footer className="footer mono">
        {profile.first} {profile.last} · {profile.title} · MMXXVI
      </footer>
    </section>
  )
}
