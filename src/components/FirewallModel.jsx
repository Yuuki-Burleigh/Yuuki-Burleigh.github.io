import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './SignalPath'

export default function FirewallModel() {
  const host = useRef(null)
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    let disposed = false, cleanup = () => {}
    setReady(false)
    const start = async () => {
      const canvas = document.createElement('canvas')
      let context
      try { context = canvas.getContext('webgl2') || canvas.getContext('webgl') } catch { return }
      if (!context) return
      try {
        const { mountFirewall } = await import('./firewallScene')
        if (disposed) { context.getExtension('WEBGL_lose_context')?.loseContext(); return }
        cleanup = await mountFirewall(host.current, canvas, context, reduce, () => {
          if (!disposed) setReady(true)
        }, () => { if (!disposed) setReady(false) })
        if (disposed) cleanup()
      } catch {
        context.getExtension('WEBGL_lose_context')?.loseContext()
        if (!disposed) setReady(false)
      }
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); start() }
    }, { rootMargin: '300px' })
    observer.observe(host.current)
    return () => { disposed = true; observer.disconnect(); cleanup() }
  }, [reduce])

  return <section id="firewall-model" className="firewall-model" aria-labelledby="hardware-title">
    <div className="section-header"><h2 className="section-title" id="hardware-title">Inspect the hardware</h2><div className="rule" /></div>
    <p id="hardware-instructions">Illustrative firewall appliance — drag to rotate</p>
    <p className="hardware-keys">Arrow keys rotate · Scroll to continue</p>
    <div ref={host} className={`firewall-stage${ready ? ' firewall-stage--ready' : ''}`}>
      <img src="media/firewall.webp" alt="Firewall appliance (still image)" />
    </div>
  </section>
}
