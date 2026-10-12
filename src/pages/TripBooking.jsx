import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useTours } from '../hooks/useData'
import PageHeader from '../components/PageHeader'
import TripBookingForm from '../components/TripBookingForm'
import { CardSkeletons, QueryError } from '../components/Loader'
import NotFound from './NotFound'

export default function TripBooking() {
  const { slug } = useParams()
  const query = useTours()
  if (query.isPending) return <div className="section-shell section-pad"><CardSkeletons count={1} className="skeleton h-[600px] rounded-3xl" /></div>
  if (query.isError) return <div className="section-shell section-pad"><QueryError onRetry={() => query.refetch()} /></div>
  const trip = query.data?.find((item) => item.slug === slug)
  if (!trip) return <NotFound />
  return <>
    <Helmet title={`Book ${trip.title} | Travel Golf Tours`}><meta name="description" content={`Request a place on ${trip.title} in ${trip.place}. No payment is required to send a request.`} /></Helmet>
    <PageHeader title={`Book ${trip.title}`} subtitle="Send a free trip request. Our local team will confirm the details with you." imageKey={trip.place.toLowerCase().includes('dahab') ? 'dahab' : trip.place.toLowerCase().includes('hurghada') ? 'hurghada' : 'sharm'} breadcrumb={[{ label: 'Destinations', to: '/destinations' }, { label: 'Trips', to: '/trips' }, { label: trip.title, to: `/trips/${trip.slug}` }, { label: 'Booking' }]} />
    <TripBookingForm trip={trip} />
    <p className="section-shell pb-12 text-center text-xs text-muted">Questions about this trip? <Link className="font-semibold text-turquoise underline" to="/contact">Contact our team</Link>.</p>
  </>
}
