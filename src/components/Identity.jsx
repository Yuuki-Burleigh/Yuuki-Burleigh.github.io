import { EnvelopeSimple, LinkedinLogo, GithubLogo, SealCheck } from '@phosphor-icons/react'
import { certs, profile } from '../data/certs'

const ports = [
  { label: 'Email me', href: `mailto:${profile.email}`, Icon: EnvelopeSimple, primary: true },
  { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedinLogo },
  { label: 'GitHub', href: profile.github, Icon: GithubLogo },
]

// The identity unit: name plate, contact ports, and the three certifications plugged in as transceiver modules.
export default function Identity() {
  return (
    <section className="identity unit" aria-label="Yuuki Burleigh">
      <div className="identity__plate">
        <h1 className="identity__name">{profile.first} {profile.last}</h1>
        <p className="identity__title">{profile.title}</p>
      </div>

      <ul className="ports" aria-label="Contact">
        {ports.map(({ label, href, Icon, primary }) => (
          <li key={label}>
            <a className={`port${primary ? ' port--lit' : ''}`} href={href} {...(primary ? {} : { target: '_blank', rel: 'noreferrer' })}>
              <span className="port__leds" aria-hidden="true"><i /><i /></span>
              <span className="port__socket" aria-hidden="true"><span /></span>
              <span className="port__label"><Icon size={15} weight={primary ? 'fill' : 'regular'} aria-hidden="true" />{label}</span>
            </a>
          </li>
        ))}
      </ul>

      <ul className="modules" id="certs" aria-label="Verified certifications">
        {certs.map((cert) => (
          <li key={cert.name} className="module">
            <span className="module__sfp" aria-hidden="true"><span className="module__bail" /><span className="module__led" /></span>
            <span className="module__badge"><img src={cert.badge} alt={`${cert.issuer} logo`} loading="lazy" /></span>
            <span className="module__body">
              <span className="module__name" title={cert.name}><span aria-hidden="true">{cert.short}</span><span className="sr-only">{cert.name}</span></span>
              <a className="module__verify" href={cert.verify} target="_blank" rel="noreferrer" aria-label={`Verify ${cert.name} credential (opens in a new tab)`}>
                <SealCheck size={13} weight="fill" aria-hidden="true" />Verify
              </a>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
