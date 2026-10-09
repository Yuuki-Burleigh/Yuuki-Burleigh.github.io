import Hero from './components/Hero'
import Nav from './components/Nav'
import Experience from './components/Experience'
import Labs from './components/Labs'
import Certs from './components/Certs'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <div className="folio-bar"><span>Yuuki Burleigh / Field manual</span><span>SEC · NET · CLOUD</span></div>
      <div className="wrap">
        <aside className="identity"><Hero /><Nav /></aside>
        <main id="content" tabIndex={-1}>
          <Experience /><Labs /><Certs /><Footer />
        </main>
      </div>
    </>
  )
}
