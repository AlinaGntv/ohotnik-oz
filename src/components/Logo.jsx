import { Link } from 'react-router'
import './Logo.css'

export default function Logo({ size = 64 }) {
  return (
    <Link
      to="/"
      className="logo"
      style={{ width: size, height: size }}
      aria-label="Охотник — на главную"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <img src="/images/logo.webp" alt="Охотник — ресторан с историей, 1975" width="480" height="480" />
    </Link>
  )
}
