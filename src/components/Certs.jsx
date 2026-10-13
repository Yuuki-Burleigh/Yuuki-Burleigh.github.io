import { certs } from '../data/certs'
export default function Certs() {
  return <section id="certs" className="content-section"><h2>Verified credentials</h2><div className="certs">{certs.map(cert => <article className="cert" key={cert.name}><img src={cert.badge} alt={`${cert.issuer} logo`} width="64" height="64" loading="lazy" /><div><h3>{cert.name}</h3><p>{cert.issuer}</p><a href={cert.verify} target="_blank" rel="noreferrer">Verify credential ↗</a></div></article>)}</div></section>
}
