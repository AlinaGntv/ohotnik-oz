import './Logo.css'

export default function Logo({ size = 64 }) {
  return (
    <a href="#top" className="logo" style={{ width: size, height: size }} aria-label="Охотник — на главную">
      <img src="/images/logo.webp" alt="Охотник — ресторан с историей, 1975" width="480" height="480" />
    </a>
  )
}
