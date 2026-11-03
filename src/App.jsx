import { CartProvider } from './context/CartContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import MenuSection from './components/MenuSection.jsx'
import Delivery from './components/Delivery.jsx'
import GrillBanner from './components/GrillBanner.jsx'
import Events from './components/Events.jsx'
import Stay from './components/Stay.jsx'
import About from './components/About.jsx'
import Gallery from './components/Gallery.jsx'
import Reviews from './components/Reviews.jsx'
import Booking from './components/Booking.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
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
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
