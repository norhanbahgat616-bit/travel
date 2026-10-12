import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found | Travel Golf Tours</title><meta name="description" content="This page wandered off. Return to Travel Golf Tours to keep exploring Egypt." /></Helmet>
      <section className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-mist text-turquoise"><Compass size={30} /></span>
          <p className="eyebrow mt-7">A little off the map</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">404</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted">We couldn’t find that page. Let’s get you back to somewhere beautiful.</p>
          <Link className="button-primary mt-7" to="/"><ArrowLeft size={16} /> Back to home</Link>
        </div>
      </section>
    </>
  )
}
