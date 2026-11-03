import { Link } from 'react-router'
import { Check } from './Icons.jsx'
import './ConsentCheckbox.css'

// Обязательное согласие на обработку персональных данных (152-ФЗ) — отдельной галочкой в каждой форме.
export default function ConsentCheckbox({ checked, onChange, className = '' }) {
  return (
    <label className={`consent ${className}`}>
      <input type="checkbox" required checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="consent__box" aria-hidden="true">
        <Check />
      </span>
      <span className="consent__text">
        Даю <Link to="/consent" target="_blank">согласие на обработку персональных данных</Link> и принимаю{' '}
        <Link to="/privacy" target="_blank">политику</Link>
      </span>
    </label>
  )
}
