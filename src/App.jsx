import Backdrop from './components/Backdrop'
import StatusBar from './components/StatusBar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Labs from './components/Labs'
import Certs from './components/Certs'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Backdrop />
      <StatusBar />
      <div className="wrap">
        <Hero />
        <Experience />
        <Labs />
        <Certs />
        <Footer />
      </div>
    </>
  )
}
