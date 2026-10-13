import { useState, useCallback, useEffect } from 'react'
import Rail from './components/Rail'
import Identity from './components/Identity'
import PacketPath from './components/PacketPath'
import PdfModal from './components/PdfModal'
import Experience from './components/Experience'
import Labs from './components/Labs'
import Footer from './components/Footer'

export default function App() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  // The browser tries #anchor before React has rendered the section, so deep links (#work, #certs…) land at the top.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <div className="rack">
        <Rail />
        <main id="content" tabIndex={-1}>
          <Identity />
          <PacketPath onOpen={setOpen} />
          <Labs onOpen={setOpen} />
          <Experience />
        </main>
        <Footer />
      </div>
      {open && <PdfModal lab={open} onClose={close} />}
    </>
  )
}
