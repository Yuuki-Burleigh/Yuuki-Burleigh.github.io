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
      <span className="seg">— SEC · NET · CLOUD</span>
      <span className="right">{clock} UTC</span>
    </div>
  )
}
