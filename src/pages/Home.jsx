import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight, Heart, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import DestinationCard from '../components/DestinationCard'
import TourCard from '../components/TourCard'
import ServiceCard from '../components/ServiceCard'
import { CardSkeletons, QueryError } from '../components/Loader'
import Photo from '../components/Photo'
import { useDestinations, useServices, useTours } from '../hooks/useData'
import { getAllImages, getImage } from '../utils/images'
import TripCalculator from '../components/TripCalculator'
import Testimonials from '../components/Testimonials'

function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const display = useTransform(motionValue, (latest) => `${Math.round(latest)}${suffix}`)
  useEffect(() => {
    if (seen) {
      const controls = animate(motionValue, value, { duration: 1.5, ease: 'easeOut' })
      return controls.stop
    }
    return undefined
  }, [seen, motionValue, value])
  return <motion.span ref={ref}>{display}</motion.span>
}

function ViewAll({ to, children = 'View all' }) {
  return <Link to={to} className="button-outline min-h-11 whitespace-nowrap">{children} <ArrowRight size={15} /></Link>
}

export default function Home() {
  const destinationsQuery = useDestinations()
  const servicesQuery = useServices()
  const toursQuery = useTours()
  const images = getAllImages().slice(0, 4)
  const whyItems = [
    { Icon: Heart, title: 'Made around you', text: 'Every trip starts with what you love, not a one-size-fits-all itinerary.' },
    { Icon: MapPin, title: 'Actually local', text: 'Our team knows these coastlines, places, and people by heart.' },
    { Icon: ShieldCheck, title: 'The details matter', text: 'We think through all the little things that make travel feel easy.' },
    { Icon: Sparkles, title: 'Room for wonder', text: 'A considered plan leaves space for the moments you never planned.' },
  ]
  return (
    <>
      <Helmet>
        <title>Home | Travel Golf Tours</title>
        <meta name="description" content="Discover Egypt your way with Travel Golf Tours. Explore the Red Sea, thoughtful local experiences, and trips made around you." />
        <meta property="og:title" content="Travel Golf Tours — Find your blue in Egypt" />
        <meta property="og:description" content="Thoughtful Egypt escapes, planned by people who know it by heart." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getImage('hero')} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'TravelAgency', name: 'Travel Golf Tours', email: 'info@travelgolftours.com', telephone: '+201015541120', address: { '@type': 'PostalAddress', addressCountry: 'EG' }, areaServed: 'Egypt' })}</script>
      </Helmet>
        <Hero />
        <div className="relative z-10 mx-auto -mt-7 w-[min(930px,calc(100%-36px))]">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/70 bg-white p-5 shadow-[0_20px_55px_#183b4e1c] sm:grid-cols-4 sm:px-9 sm:py-6">
            {[[2400, 'Happy guests', 'k+'], [180, 'Curated trips', '+'], [5, 'Coastlines', ''], [12, 'Years local', '+']].map(([value, label, suffix]) => (
              <div className="text-center" key={label}><p className="text-2xl font-bold tracking-tight text-turquoise sm:text-3xl"><Counter value={value} suffix={suffix} /></p><p className="mt-1 text-[11px] text-muted sm:text-xs">{label}</p></div>
            ))}
          </div>
        </div>

        <section className="section-pad">
          <div className="section-shell">
            <Reveal><SectionTitle eyebrow="The Egypt you came for" title="Find your kind of somewhere." description="Red Sea blues, mountain air, slow coastal mornings. Find the corner of Egypt that feels like yours." /></Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destinationsQuery.isPending && <CardSkeletons count={3} className="col-span-full grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />}
              {destinationsQuery.isError && <div className="col-span-full"><QueryError onRetry={() => destinationsQuery.refetch()} /></div>}
              {destinationsQuery.data?.slice(0, 3).map((destination, index) => <DestinationCard key={destination.slug} destination={destination} index={index} />)}
            </div>
            <Reveal className="mt-8 flex justify-center"><ViewAll to="/destinations">Explore all destinations</ViewAll></Reveal>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="section-shell">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <Reveal><SectionTitle align="left" eyebrow="The details, taken care of" title="Travel, made a little easier." description="Thoughtful help for every part of your journey." /></Reveal>
              <ViewAll to="/services">All services</ViewAll>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicesQuery.isPending && <CardSkeletons count={3} className="col-span-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />}
              {servicesQuery.isError && <div className="col-span-full"><QueryError onRetry={() => servicesQuery.refetch()} /></div>}
              {servicesQuery.data?.slice(0, 3).map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <Reveal><SectionTitle align="left" eyebrow="Made to be remembered" title="A few good ways to begin." description="A little inspiration for your next trip. Every journey can be made entirely your own." /></Reveal>
              <ViewAll to="/trips">Explore all trips</ViewAll>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {toursQuery.isPending && <CardSkeletons count={3} className="col-span-full grid gap-6 md:grid-cols-2 lg:grid-cols-3" />}
              {toursQuery.isError && <div className="col-span-full"><QueryError onRetry={() => toursQuery.refetch()} /></div>}
              {toursQuery.data?.slice(0, 3).map((tour, index) => <TourCard key={tour.slug} tour={tour} index={index} />)}
            </div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="section-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="relative">
              <Photo src={getImage('about', 1)} alt="The Sinai mountains rising above the Red Sea" className="relative h-[400px] rounded-[32px] sm:h-[490px]" />
              <div className="absolute -bottom-5 right-4 rounded-2xl bg-white p-5 shadow-xl sm:-right-5"><p className="text-xs text-muted">Thoughtfully local</p><p className="mt-1 text-lg font-semibold">Egypt, by heart.</p></div>
            </Reveal>
            <Reveal delay={.1}>
              <SectionTitle align="left" eyebrow="Not just a place. A feeling." title="We know Egypt by heart." description="We’re a local team of curious people who believe the best trips leave space for the unexpected. We make every detail feel effortless — and every moment feel like yours." />
              <Link to="/about" className="button-primary mt-7">Meet the team <ArrowRight size={16} /></Link>
            </Reveal>
          </div>
        </section>

        <section className="section-pad bg-mist">
          <div className="section-shell">
            <Reveal><SectionTitle eyebrow="Why travel with us" title="Good people. Thoughtful details." description="The best trips happen when someone local cares about every detail." /></Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyItems.map(({ Icon, title, text }, index) => <Reveal delay={index * .06} key={title}><article className="h-full rounded-3xl bg-white p-6 shadow-[0_10px_34px_#183b4e08]"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-turquoise"><Icon size={21} /></span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{text}</p></article></Reveal>)}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="section-shell">
            <Reveal><SectionTitle eyebrow="Plan with confidence" title="A useful first estimate." description="Adjust your stay and extras to see a sample trip budget." /></Reveal>
            <div className="mt-10"><TripCalculator /></div>
            <div className="mt-6 text-center"><ViewAll to="/calculator">Open the trip calculator</ViewAll></div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="section-shell">
            <Reveal><SectionTitle eyebrow="Kind words from the coast" title="Trips that stay with you." description="A few notes from travellers who let us help plan their Egypt escape." /></Reveal>
            <Testimonials />
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="section-shell">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <Reveal><SectionTitle align="left" eyebrow="A little glimpse" title="Postcards from Egypt." description="A few of the places and moments waiting along the way." /></Reveal>
              <ViewAll to="/gallery">Visit the gallery</ViewAll>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((image, index) => <Reveal key={image.src} delay={index * .05}><Link to="/gallery" className={`group block overflow-hidden rounded-2xl ${index === 1 ? 'sm:mt-8' : ''}`}><Photo src={image.src} alt={image.title || 'Egypt travel photograph'} className="h-44 transition-transform duration-700 group-hover:scale-105 sm:h-60" /></Link></Reveal>)}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <Reveal className="section-shell overflow-hidden rounded-[32px] bg-navy px-7 py-12 text-center text-white sm:px-12 sm:py-16">
            <p className="eyebrow text-sun">Your next chapter</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Let’s make a little room for wonder.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">Tell us what a perfect trip looks like. Our local team will help you find your Egypt.</p>
            <Link className="button-primary mt-7" to="/trips">Browse trips <ArrowRight size={16} /></Link>
          </Reveal>
        </section>
    </>
  )
}
