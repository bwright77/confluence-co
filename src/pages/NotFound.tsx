import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cc-sand text-center px-4">
      <h1 className="heading-display text-6xl text-cc-navy mb-4">404</h1>
      <p className="font-body text-xl text-cc-stone mb-8">This page doesn't exist — yet.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
