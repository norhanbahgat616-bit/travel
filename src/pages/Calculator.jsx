import { Helmet } from 'react-helmet-async'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import TripCalculator from '../components/TripCalculator'

export default function Calculator() {
  return <>
    <Helmet><title>Trip Cost Calculator | Travel Golf Tours</title><meta name="description" content="Estimate a sample Egypt holiday budget with our trip cost calculator." /></Helmet>
    <PageHeader title="A first look at the numbers." subtitle="Build a sample trip estimate, then send it to our local team to shape a real plan." imageKey="booking" breadcrumb={[{ label: 'Calculator' }]} />
    <section className="section-pad"><div className="section-shell"><Reveal><SectionTitle eyebrow="Your trip, your pace" title="Estimate your Egypt escape." description="Sample estimates help you compare options. Final prices depend on dates, availability, and your choices." /></Reveal><div className="mt-10"><TripCalculator /></div><p className="mt-5 text-xs text-muted">All displayed prices and exchange rates are sample placeholders. Request a quote for current availability.</p></div></section>
  </>
}
