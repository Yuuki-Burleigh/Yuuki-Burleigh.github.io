import { useEffect, useRef, useState } from 'react'
// pdf.js (~350 kB) is fetched on first use instead of shipping in the entry bundle.
const pdfLib = () => import('./pdf')

// Renders page 1 of a PDF into the returned canvas ref at `width` CSS px. state: loading | ready | error
export default function usePdfThumb(file, width) {
  const ref = useRef(null)
  const [state, setState] = useState('loading')
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const lib = await pdfLib()
        const pdf = await lib.loadPdf(file)
        if (cancelled) return
        const page = await pdf.getPage(1)
        if (cancelled || !ref.current) return
        await lib.renderPage(page, ref.current, width / page.getViewport({ scale: 1 }).width)
        if (!cancelled) setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    })()
    return () => { cancelled = true }
  }, [file, width])
  return [ref, state]
}
