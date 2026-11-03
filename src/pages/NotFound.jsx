import { Link } from 'react-router'
import { ArrowRight } from '../components/Icons.jsx'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="not-found dark">
      <div className="container not-found__inner">
        <span className="not-found__code">404</span>
        <h1 className="section-title">Такой страницы нет</h1>
        <p className="lead">Возможно, ссылка устарела или в адресе опечатка.</p>
        <Link to="/" className="btn btn--gold">
          На главную <ArrowRight />
        </Link>
      </div>
    </section>
  )
}
