import { useEffect, useRef } from 'react'

// Living "link map": drifting amber nodes with proximity-linked edges.
// Fixed full-viewport canvas behind everything. Honors reduced-motion.
export default function Backdrop() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let nodes = []
    let w = 0
    let h = 0
    let raf = 0
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const init = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
      const count = Math.min(80, Math.floor((w * h) / 19000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.7,
      }))
    }

    const draw = (animate) => {
      ctx.clearRect(0, 0, w, h)
      if (animate) {
        for (const n of nodes) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 150) {
            ctx.strokeStyle = `rgba(255,170,60,${(1 - d / 150) * 0.5})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(255,191,107,0.85)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (animate) raf = requestAnimationFrame(() => draw(true))
    }

    const onResize = () => {
      cancelAnimationFrame(raf)
      init()
      draw(!reduce)
    }

    init()
    draw(!reduce)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas id="netCanvas" ref={ref} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  )
}
