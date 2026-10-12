import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Heart, MapPin, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import Photo from '../components/Photo'
import { getImage } from '../utils/images'

const values = [
  { Icon: Heart, title: 'Care, in the details', text: 'We believe care shows up in the small things: a well-timed ride, a thoughtful recommendation, and a person who remembers what matters to you.' },
  { Icon: MapPin, title: 'Local, always', text: 'Egypt is home. Our local knowledge helps us share places and people with care, curiosity, and respect.' },
  { Icon: ShieldCheck, title: 'Clear and considered', text: 'We’ll give you practical information and honest guidance, so you can make decisions that feel right for you.' },
  { Icon: Sparkles, title: 'Space for the unexpected', text: 'A good plan makes room for the moments that become your favourite stories.' },
]

export default function About() {
  return (
    <>
      <Helmet><title>About | Travel Golf Tours</title><meta name="description" content="Meet Travel Golf Tours, a local Egypt travel team creating thoughtful journeys along the coast." /></Helmet>
      <PageHeader title="Egypt is more than a destination." subtitle="It’s the people, the pace, the small moments you remember long after you’re home. We’re here to help you find them." imageKey="about" breadcrumb={[{ label: 'About' }]} />
      <section className="section-pad bg-white"><div className="section-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20"><Reveal><Photo src={getImage('about', 1)} alt="Red Sea coastline and Sinai mountains" className="h-[380px] rounded-3xl sm:h-[500px]" /></Reveal><Reveal delay={.1}><SectionTitle align="left" eyebrow="A little about us" title="We know Egypt by heart." description="Travel Golf Tours began with a simple idea: the best way to experience Egypt is with people who know it, love it, and want to share it thoughtfully. We’re a local team of curious people who plan journeys around the traveller — not the other way around." /><p className="mt-5 text-sm leading-7 text-muted">From a first question to the last ride home, we stay close to the details and leave room for you to discover the country in your own way.</p></Reveal></div></section>
      <section className="section-pad"><div className="section-shell"><Reveal><SectionTitle eyebrow="What matters to us" title="Travel should feel good, all the way through." description="The way we plan matters just as much as where you go." /></Reveal><div className="mt-12 grid gap-5 sm:grid-cols-2">{values.map(({ Icon, title, text }, index) => <Reveal key={title} delay={index * .06}><article className="h-full rounded-3xl bg-white p-7 shadow-[0_12px_35px_#183b4e08]"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-turquoise"><Icon size={22} /></span><h2 className="mt-5 text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-muted">{text}</p></article></Reveal>)}</div></div></section>
      <section className="section-pad bg-navy text-white"><div className="section-shell grid items-center gap-8 md:grid-cols-[1fr_auto]"><div><p className="eyebrow text-sun">Your next story</p><h2 className="mt-3 text-3xl font-semibold">Let’s find your Egypt.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-white/70">Explore the trips we’ve designed, then book directly from a trip detail page.</p></div><Link to="/trips" className="button-primary whitespace-nowrap">Explore trips <ArrowRight size={16} /></Link></div></section>
    </>
  )
}
