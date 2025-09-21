import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="text-center space-y-3">
      <h1 className="text-2xl font-semibold">404</h1>
      <p>Page not found.</p>
      <Link className="text-blue-600 dark:text-blue-400 underline" to="/">Go Home</Link>
    </section>
  )
}

