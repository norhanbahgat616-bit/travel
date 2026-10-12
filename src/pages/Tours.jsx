import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDestinations, useTours } from '../hooks/useData'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import TourCard from '../components/TourCard'
import { CardSkeletons, QueryError } from '../components/Loader'
import { useCurrency } from '../context/useCurrency'

export default function Tours() {
  const query = useTours()
  const destinationsQuery = useDestinations()
  const [searchParams, setSearchParams] = useSearchParams()
  const destinationFilter = searchParams.get('destination') || ''
  const [selected, setSelected] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const { formatPrice } = useCurrency()
  const toggleCompare = (tour, checked) => setSelected((current) => checked ? (current.length < 3 ? [...current, tour] : current) : current.filter((item) => item.slug !== tour.slug))
  return (
    <>
      <Helmet><title>Trips | Travel Golf Tours</title><meta name="description" content="Explore thoughtfully planned trips in Egypt, shaped by local knowledge and your own interests." /></Helmet>
      <PageHeader title="Good days, already thought through." subtitle="Small-group and private journeys to the places that stay with you." imageKey="tours" breadcrumb={[{ label: 'Destinations', to: '/destinations' }, { label: 'Trips' }]} />
      <section className="section-pad">
        <div className="section-shell">
          <Reveal><SectionTitle eyebrow="A few good ways to begin" title="Find your next favourite story." description="A little inspiration for your next trip. Every journey can be made entirely your own." /></Reveal>
          <label className="mx-auto mt-8 block max-w-sm"><span className="field-label">Filter trips by destination</span><select className="field-input" value={destinationFilter} onChange={(event) => setSearchParams(event.target.value ? { destination: event.target.value } : {})}><option value="">All destinations</option>{destinationsQuery.data?.map((destination) => <option value={destination.name} key={destination.slug}>{destination.name}</option>)}</select></label>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {query.isPending && <CardSkeletons count={3} className="col-span-full grid gap-6 md:grid-cols-2 lg:grid-cols-3" />}
            {query.isError && <div className="col-span-full"><QueryError onRetry={() => query.refetch()} /></div>}
            {query.data?.filter((trip) => !destinationFilter || trip.place === destinationFilter).map((tour, index) => <TourCard key={tour.slug} tour={tour} index={index} compare selected={selected.some((item) => item.slug === tour.slug)} onCompareChange={toggleCompare} />)}
          </div>
          {!query.isPending && query.data?.filter((trip) => !destinationFilter || trip.place === destinationFilter).length === 0 && <p className="col-span-full py-8 text-center text-sm text-muted">No trips are listed for this destination yet.</p>}
          <Reveal className="mt-14 rounded-3xl bg-mist p-8 text-center sm:p-10"><h2 className="text-2xl font-semibold">Something a little different in mind?</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted">We’d love to hear about it. Explore our trips and packages or send us a general question.</p><Link className="button-primary mt-6" to="/contact">Ask our team</Link></Reveal>
        </div>
      </section>
      {selected.length > 0 && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7efef] bg-white p-4 shadow-2xl"><div className="section-shell flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold">{selected.length} of 3 trips selected</p><button className="button-primary min-h-10" disabled={selected.length < 2} onClick={() => setCompareOpen(true)}>Compare now</button></div></div>}
      <AnimatePresence>{compareOpen && <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#071821]/70 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Compare trips" onMouseDown={(event) => { if (event.target === event.currentTarget) setCompareOpen(false) }} onKeyDown={(event) => { if (event.key === 'Escape') setCompareOpen(false) }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-8" initial={{ y: 12 }} animate={{ y: 0 }}><button onClick={() => setCompareOpen(false)} aria-label="Close trip comparison" className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-mist"><X size={18} /></button><h2 className="text-2xl font-semibold">Compare trips</h2><div className="mt-6 grid gap-4" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}>{selected.map((tour) => <article key={tour.slug} className="min-w-0 rounded-2xl border border-[#e7efef] p-4"><h3 className="font-semibold">{tour.title}</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-muted">Destination</dt><dd>{tour.place}</dd></div><div><dt className="text-xs text-muted">Duration</dt><dd>{tour.days} days</dd></div><div><dt className="text-xs text-muted">Price per person</dt><dd>{formatPrice(tour.price)}</dd></div><div><dt className="text-xs text-muted">Rating</dt><dd>{tour.rating.toFixed(1)} / 5</dd></div><div><dt className="text-xs text-muted">Highlights</dt><dd>{tour.highlights?.slice(0, 3).join(', ') || tour.tag}</dd></div></dl></article>)}</div></motion.div></motion.div>}</AnimatePresence>
    </>
  )
}
