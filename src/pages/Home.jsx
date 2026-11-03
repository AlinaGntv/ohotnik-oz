import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import MenuSection from '../components/MenuSection.jsx'
import Delivery from '../components/Delivery.jsx'
import GrillBanner from '../components/GrillBanner.jsx'
import Events from '../components/Events.jsx'
import Stay from '../components/Stay.jsx'
import About from '../components/About.jsx'
import Gallery from '../components/Gallery.jsx'
import Reviews from '../components/Reviews.jsx'
import Booking from '../components/Booking.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <MenuSection />
      <Delivery />
      <GrillBanner />
      <Events />
      <Stay />
      <About />
      <Gallery />
      <Reviews />
      <Booking />
    </>
  )
}
