import { useEffect, useState } from 'react'

const sections = [['experience', 'Experience'], ['work', 'Lab documentation'], ['certs', 'Certifications']]
export default function Nav() {
  const [active, setActive] = useState('experience')
  useEffect(() => {
    const update = () => {
      let current = sections[0][0]
      for (const [id] of sections) {
        if (document.getElementById(id)?.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <nav className="section-nav" aria-label="Portfolio sections">
    {sections.map(([id, label], i) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
      <span className="nav-index">0{i + 1}</span><span>{label}</span><span className="nav-line" />
    </a>)}
  </nav>
}
