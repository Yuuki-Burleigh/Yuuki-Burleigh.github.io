import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [clock, setClock] = useState('--:--:--')
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="statusbar">
      <span className="dot" />
      <span>node://yuuki-burleigh</span>
      <nav aria-label="Sections"><a href="#experience">Experience</a><a href="#work">Lab documentation</a><a href="#certs">Certifications</a></nav>
      <span className="right">{clock} UTC</span>
    </div>
  )
}
