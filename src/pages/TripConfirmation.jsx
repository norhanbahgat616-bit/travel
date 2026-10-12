import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Check, Printer } from 'lucide-react'
import { readStoredList } from '../utils/validators'
import PageHeader from '../components/PageHeader'
import NotFound from './NotFound'

export default function TripConfirmation() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const reference = searchParams.get('ref')
  const booking = location.state?.booking || readStoredList('bookings').find((item) => item.id === reference && item.tripSlug === slug)
  if (!booking) return <NotFound />
  return <>
    <Helmet title={`Trip Request Confirmed | Travel Golf Tours`}><meta name="description" content={`Trip request ${booking.id} has been received by Travel Golf Tours.`} /></Helmet>
    <PageHeader title="Your trip request is in." subtitle="Our local team will be in touch to confirm the details." imageKey="booking" breadcrumb={[{ label: 'Trips', to: '/trips' }, { label: 'Request received' }]} />
    <section className="section-shell py-12 sm:py-16">
      <article className="print-summary mx-auto max-w-3xl rounded-3xl border border-[#e7efef] bg-white p-6 shadow-xl sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-turquoise"><Check size={25} /></span><div><p className="eyebrow">Request received</p><h2 className="mt-1 text-2xl font-semibold">{booking.tripTitle}</h2><p className="mt-2 text-sm text-muted">Reference code <strong className="text-navy">{booking.id}</strong></p></div></div>
          <button type="button" className="button-outline print-hidden" onClick={() => window.print()}><Printer size={16} />Print summary</button>
        </div>
        <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-[#edf1f1] pt-6 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-muted">Traveler</dt><dd className="mt-1 font-semibold">{booking.name}</dd></div>
          <div><dt className="text-xs text-muted">Email</dt><dd className="mt-1 font-semibold">{booking.email}</dd></div>
          <div><dt className="text-xs text-muted">Destination</dt><dd className="mt-1 font-semibold">{booking.destination}</dd></div>
          <div><dt className="text-xs text-muted">Preferred date</dt><dd className="mt-1 font-semibold">{booking.date}</dd></div>
          <div><dt className="text-xs text-muted">Travelers</dt><dd className="mt-1 font-semibold">{booking.travelers}</dd></div>
          <div><dt className="text-xs text-muted">Room / transport</dt><dd className="mt-1 font-semibold">{booking.preference}</dd></div>
          <div><dt className="text-xs text-muted">Price per person</dt><dd className="mt-1 font-semibold">EGP {Number(booking.pricePerPerson).toLocaleString()}</dd></div>
          <div><dt className="text-xs text-muted">Estimated total</dt><dd className="mt-1 font-semibold">EGP {Number(booking.estimatedTotal).toLocaleString()}</dd></div>
          {booking.notes && <div className="sm:col-span-2"><dt className="text-xs text-muted">Special requests</dt><dd className="mt-1 whitespace-pre-wrap font-medium">{booking.notes}</dd></div>}
        </dl>
        <div className="print-hidden mt-8 flex flex-col gap-3 sm:flex-row"><Link className="button-primary" to="/trips">Back to trips</Link><Link className="button-outline" to="/dashboard">Go to dashboard</Link></div>
      </article>
    </section>
  </>
}
