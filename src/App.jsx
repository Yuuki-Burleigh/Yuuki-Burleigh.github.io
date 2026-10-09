import StatusBar from './components/StatusBar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Labs from './components/Labs'
import Certs from './components/Certs'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <StatusBar />
      <main className="wrap" id="content" tabIndex={-1}>
        <Hero />
        <Experience />
        <Labs />
        <Certs />
        <Footer />
      </main>
    </>
  )
}
