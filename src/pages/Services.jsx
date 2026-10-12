import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import ServiceCard from '../components/ServiceCard'
import { CardSkeletons, QueryError } from '../components/Loader'
import { useServices } from '../hooks/useData'

export default function Services() {
  const query = useServices()
  return (
    <>
      <Helmet><title>Travel Services | Travel Golf Tours</title><meta name="description" content="Flights, stays, tours, transfers, visa guidance, and local support for your Egypt trip." /></Helmet>
      <PageHeader title="Good travel starts with good details." subtitle="Local help for every part of the journey, from your first flight to your last ride home." imageKey="services" breadcrumb={[{ label: 'Services' }]} />
      <section className="section-pad bg-white">
        <div className="section-shell">
          <Reveal><SectionTitle eyebrow="Ways we can help" title="Travel, made a little easier." description="Pick the kind of help you need. We’ll take care of the details and leave room for the good stuff." /></Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {query.isPending && <CardSkeletons count={6} className="col-span-full grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />}
            {query.isError && <div className="col-span-full"><QueryError onRetry={() => query.refetch()} /></div>}
            {query.data?.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-3 border-t border-[#e7efef] pt-8"><Link className="button-outline" to="/trips">Browse trips</Link><Link className="button-outline" to="/visas">Visa guidance</Link><Link className="button-outline" to="/calculator">Trip calculator</Link><Link className="button-outline" to="/gallery">Photo gallery</Link></div>
        </div>
      </section>
    </>
  )
}
