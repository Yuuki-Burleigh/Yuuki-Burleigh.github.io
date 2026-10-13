import { useState, useCallback, useEffect } from 'react'
import Nav from './components/Nav'
import PdfModal from './components/PdfModal'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Labs from './components/Labs'
import Certs from './components/Certs'
import Footer from './components/Footer'

export default function App() {
  const [open, setOpen] = useState(null)
  const [light, setLight] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = light ? 'light' : 'dark' }, [light])
  const close = useCallback(() => setOpen(null), [])
  // The browser tries #anchor before React has rendered the section, so deep links (#firewall-model, #work…) land at the top.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id || new URLSearchParams(location.search).has('solo')) return
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <Nav light={light} onTheme={() => setLight(v => !v)} />
      <main className="wrap" id="content" tabIndex={-1}>
        <Hero onOpen={setOpen} />
        <Labs onOpen={setOpen} />
        <Certs />
        <Experience />
        <Footer />
      </main>
      {open && <PdfModal lab={open} onClose={close} />}
    </>
  )
}
