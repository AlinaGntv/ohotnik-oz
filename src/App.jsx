import { Route, Routes } from 'react-router'
import { CartProvider } from './context/CartContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import Home from './pages/Home.jsx'
import Privacy from './pages/legal/Privacy.jsx'
import Consent from './pages/legal/Consent.jsx'
import Offer from './pages/legal/Offer.jsx'
import Requisites from './pages/legal/Requisites.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <CartProvider>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/requisites" element={<Requisites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
