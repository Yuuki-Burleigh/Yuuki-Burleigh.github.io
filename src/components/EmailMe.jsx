import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { profile } from '../data/certs'

const to = encodeURIComponent(profile.email)
const subject = encodeURIComponent('Hello from your portfolio')
const webmail = [
  ['Gmail', `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`],
  ['Outlook', `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}`],
  ['Yahoo Mail', `https://compose.mail.yahoo.com/?to=${to}&subject=${subject}`],
]

// "Email me" stays a real mailto link (no JS, or ctrl/cmd-click, still works). A plain click opens a
// chooser instead, because many visitors have no desktop mail app and a bare mailto does nothing for them.
export default function EmailMe({ className }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pos, setPos] = useState(null)
  const trigger = useRef(null)
  const pop = useRef(null)

  // Fixed position from the trigger's box, rendered into <body> so no overflow:hidden parent clips it;
  // it opens below the trigger, or above when there is no room.
  useLayoutEffect(() => {
    if (!open) return
    const r = trigger.current.getBoundingClientRect()
    const h = pop.current?.offsetHeight ?? 280
    const w = pop.current?.offsetWidth ?? 260
    const below = r.bottom + 8 + h <= window.innerHeight
    setPos({
      top: below ? r.bottom + 8 : r.top - 8 - h,
      left: Math.min(Math.max(8, r.left), window.innerWidth - w - 8),
      origin: below ? 'top left' : 'bottom left',
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close()
        trigger.current?.focus()
      }
    }
    const onDown = (e) => {
      if (!pop.current?.contains(e.target) && !trigger.current?.contains(e.target)) close()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', close)
      window.removeEventListener('resize', close)
    }
  }, [open])

  // move focus into the chooser once it is positioned (a hidden element cannot take focus)
  useEffect(() => {
    if (open && pos) pop.current?.querySelector('a, button')?.focus()
  }, [open, pos])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <a
        ref={trigger}
        className={className}
        href={`mailto:${profile.email}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          e.preventDefault()
          setCopied(false)
          setPos(null)
          setOpen((value) => !value)
        }}
      >
        Email me
      </a>
      {open &&
        createPortal(
          <div
            ref={pop}
            className="email-pop"
            role="dialog"
            aria-label="Email me with"
            style={pos ? { top: pos.top, left: pos.left, transformOrigin: pos.origin } : { visibility: 'hidden' }}
          >
            <p className="email-pop-to">
              To <strong>{profile.email}</strong>
            </p>
            {webmail.map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                {name} <span aria-hidden="true">↗</span>
              </a>
            ))}
            <button
              onClick={() => {
                window.location.href = `mailto:${profile.email}`
                setOpen(false)
              }}
            >
              Mail app
            </button>
            <button onClick={copy} aria-live="polite">
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
