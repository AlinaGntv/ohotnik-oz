const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export const ArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const ArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
)

export const Phone = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
)

export const Clock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const Pin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)

export const Truck = (p) => (
  <svg {...base} {...p}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
)

export const Cart = (p) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
    <circle cx="9" cy="19.5" r="1.4" />
    <circle cx="17" cy="19.5" r="1.4" />
  </svg>
)

export const Calendar = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)

export const Play = (p) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
)

export const Quote = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M4 18v-5.5C4 8.4 6.1 6 9.5 5.5l.5 1.8C8 7.9 7.1 9.2 7 11h3v7zm10 0v-5.5c0-4.1 2.1-6.5 5.5-7l.5 1.8c-2 .6-2.9 1.9-3 3.7h3v7z" />
  </svg>
)

export const Star = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
  </svg>
)

export const Flame = (p) => (
  <svg {...base} strokeWidth={1.3} {...p}>
    <path d="M12 21c-4 0-6.5-2.7-6.5-6.3 0-3.6 2.6-5.6 3.7-8.7.9 2 2 3 3 3.5-.3-2.6.7-5 2.8-6.5-.2 3.3 1.6 5 2.8 6.8 1 1.5 1.7 3 1.7 4.9C19.5 18.3 16 21 12 21z" />
    <path d="M12 21c-1.8 0-3-1.3-3-3.1 0-2 1.6-3 2.3-4.8 1.6 1.3 3.7 2.8 3.7 4.8 0 1.8-1.2 3.1-3 3.1z" />
  </svg>
)

export const ChefHat = (p) => (
  <svg {...base} strokeWidth={1.3} {...p}>
    <path d="M7 14.5c-2.3-.4-4-2.3-4-4.6A4.7 4.7 0 0 1 8 5.3a4.9 4.9 0 0 1 8 0 4.7 4.7 0 0 1 5 4.6c0 2.3-1.7 4.2-4 4.6V20H7z" />
    <path d="M7 17h10M10 14v3M14 14v3" />
  </svg>
)

export const Car = (p) => (
  <svg {...base} strokeWidth={1.3} {...p}>
    <path d="M3 15v-3l2.2-5A2 2 0 0 1 7 6h10a2 2 0 0 1 1.8 1l2.2 5v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    <path d="M3 12h18M5 16v2.5M19 16v2.5" />
    <circle cx="7.5" cy="13.8" r=".9" />
    <circle cx="16.5" cy="13.8" r=".9" />
  </svg>
)

export const People = (p) => (
  <svg {...base} strokeWidth={1.3} {...p}>
    <circle cx="12" cy="6.5" r="2.5" />
    <circle cx="5.5" cy="9" r="2" />
    <circle cx="18.5" cy="9" r="2" />
    <path d="M8 21v-5.5a4 4 0 0 1 8 0V21M2.5 21v-4a3 3 0 0 1 5-2.2M21.5 21v-4a3 3 0 0 0-5-2.2" />
  </svg>
)

export const Whatsapp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2z" />
  </svg>
)

export const Telegram = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.5 4.3 18.3 19.6c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L5.9 13.3 1.2 11.8c-1-.3-1-1 .2-1.5l18.6-7.2c.9-.3 1.6.2 1.5 1.2z" />
  </svg>
)

export const Vk = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12.8 17.5C6.6 17.5 3.1 13.3 3 6.3h3.1c.1 5.2 2.4 7.3 4.2 7.8V6.3h2.9v4.4c1.8-.2 3.7-2.2 4.3-4.4h2.9c-.5 2.7-2.5 4.7-3.9 5.5 1.4.7 3.7 2.4 4.5 5.7h-3.2c-.7-2.2-2.4-3.8-4.7-4v4z" />
  </svg>
)

export const Instagram = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" />
  </svg>
)

export const Check = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const Percent = (p) => (
  <svg {...base} {...p}>
    <path d="M19 5 5 19" />
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="17" cy="17" r="2.5" />
  </svg>
)

export const Wallet = (p) => (
  <svg {...base} strokeWidth={1.3} {...p}>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
    <rect x="4" y="8" width="16" height="11" rx="2" />
    <path d="M15.5 13.5h1.5" />
  </svg>
)

export const Users = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0M16 4.5a3.2 3.2 0 0 1 0 6.3M18 14a6 6 0 0 1 3 6" />
  </svg>
)

export const Max = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.5 13.5h-1.8V10l-2.7 4h-.1l-2.6-4v5.5H7.5v-8h1.9l2.6 4 2.6-4h1.9z" />
  </svg>
)
