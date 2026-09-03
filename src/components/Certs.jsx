import { certs } from '../data/certs'
import Reveal from './Reveal'

export default function Certs() {
  const count = String(certs.length).padStart(2, '0')
  return (
    <section id="certs">
      <div className="section-header">
        <div className="section-title">
          <span className="slash">//</span> Certifications
          <span className="count">[ {count} ]</span>
        </div>
        <div className="rule" />
      </div>

      <div className="grid">
        {certs.map((cert, i) => (
          <Reveal key={cert.name} delay={i * 0.08}>
            <article className="cert-card">
              <div className="cert-badge">
                <img src={cert.badge} alt={`${cert.issuer} logo`} loading="lazy" />
              </div>
              <div>
                <h3 className="cert-name">{cert.name}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <a className="cert-verify" href={cert.verify} target="_blank" rel="noreferrer">
                  verify_credential ↗
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
