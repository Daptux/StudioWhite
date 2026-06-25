import Header from '../components/Header'
import Hero from '../components/Hero'
import IdealPara from '../components/IdealPara'
import Benefits from '../components/Benefits'
import Spaces from '../components/Spaces'
import Photographers from '../components/Photographers'
import HowItWorks from '../components/HowItWorks'
import Rules from '../components/Rules'
import FAQ from '../components/FAQ'
import CtaReserva from '../components/CtaReserva'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'

export default function PublicSite() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <IdealPara />
        <Benefits />
        <Spaces />
        <Photographers />
        <HowItWorks />
        <Rules />
        <FAQ />
        <CtaReserva />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
