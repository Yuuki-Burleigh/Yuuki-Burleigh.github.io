// Single shared pdf.js instance + worker wiring for Vite.
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

// Cache documents by file path so thumbnail + modal reuse one load.
const docCache = new Map()

export function loadPdf(file) {
  const url = encodeURI(file)
  if (!docCache.has(url)) {
    docCache.set(url, pdfjsLib.getDocument(url).promise)
  }
  return docCache.get(url)
}

// Render a page onto a canvas with HiDPI oversampling for crisp diagrams.
export async function renderPage(page, canvas, scale) {
  const dpr = Math.max(2.5, window.devicePixelRatio || 1)
  const viewport = page.getViewport({ scale })
  const ctx = canvas.getContext('2d')
  canvas.width = Math.floor(viewport.width * dpr)
  canvas.height = Math.floor(viewport.height * dpr)
  canvas.style.width = `${Math.floor(viewport.width)}px`
  canvas.style.height = `${Math.floor(viewport.height)}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  await page.render({ canvasContext: ctx, viewport }).promise
}
