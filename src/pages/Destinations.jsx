import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import DestinationCard from '../components/DestinationCard'
import { CardSkeletons, QueryError } from '../components/Loader'
import { useDestinations } from '../hooks/useData'

export default function Destinations() {
  const query = useDestinations()
  return (
    <>
      <Helmet><title>Destinations | Travel Golf Tours</title><meta name="description" content="Explore Egypt’s Red Sea escapes and Mediterranean coast with Travel Golf Tours." /></Helmet>
      <PageHeader title="A coastline for every kind of you." subtitle="From the stillness of Dahab to the easy energy of Alexandria, find a place that feels like yours." imageKey="sharm" breadcrumb={[{ label: 'Destinations' }]} />
      <section className="section-pad">
        <div className="section-shell">
          <Reveal><SectionTitle eyebrow="Pick your somewhere" title="Meet Egypt’s coast." description="Five very different places. One beautiful country. Start with the place that’s been on your mind." /></Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {query.isPending && <CardSkeletons count={5} className="col-span-full grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />}
            {query.isError && <div className="col-span-full"><QueryError onRetry={() => query.refetch()} /></div>}
            {query.data?.map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} />)}
          </div>
          <Reveal className="mt-12 rounded-3xl bg-mist p-8 text-center sm:p-10"><p className="eyebrow">A trip with your name on it</p><h2 className="mt-3 text-2xl font-semibold">Not sure which place feels like you?</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted">Explore trips for each destination or ask our local team to help you find the right coast.</p><Link to="/trips" className="button-primary mt-6">Browse trips</Link></Reveal>
        </div>
      </section>
    </>
  )
}
