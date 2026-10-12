import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Search, Heart } from 'lucide-react'
import { useVisas } from '../hooks/useData'
import { commonDocs, visaFaq, visaSteps } from '../data/visas'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import FAQAccordion from '../components/FAQAccordion'
import VisaRequestForm from '../components/VisaRequestForm'
import { QueryError } from '../components/Loader'
import { useWishlist } from '../context/useWishlist'
import { useCurrency } from '../context/useCurrency'
import { useLanguage } from '../context/useLanguage'

const filters = ['All', 'Tourist', 'Religious', 'Business']

export default function Visas() {
  const query = useVisas()
  const { isSaved, toggle } = useWishlist()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const items = useMemo(() => (query.data || []).filter((visa) => (
    (filter === 'All' || visa.type === filter) && `${visa.country} ${visa.title}`.toLowerCase().includes(search.toLowerCase())
  )), [query.data, filter, search])
  return (
    <>
      <Helmet><title>Visa Support | Travel Golf Tours</title><meta name="description" content="Explore travel visa guidance for Turkey, the UAE, Saudi Arabia, Schengen, the United Kingdom, and the United States." /></Helmet>
      <PageHeader title="A little clearer on the paperwork." subtitle="Helpful visa application guidance for your next trip. We’ll help you understand the steps before you apply." imageKey="visa" breadcrumb={[{ label: 'Visas' }]} />
      <section className="section-pad">
        <div className="section-shell">
          <Reveal><SectionTitle eyebrow="Visa guidance" title="Where are you headed?" description="Choose a destination to see common requirements and useful next steps." /></Reveal>
          <p className="mt-6 rounded-xl bg-[#fff8e9] px-4 py-3 text-xs leading-6 text-[#78653d]">Visa requirements, fees, and processing times are samples and can change. Always confirm current requirements with the official authority. We cannot guarantee approval.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter visas by type">{filters.map((item) => <button className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filter === item ? 'bg-turquoise text-white' : 'bg-white text-muted ring-1 ring-[#e6eeee] hover:text-turquoise'}`} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div>
            <label className="relative w-full sm:max-w-xs"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} /><input className="field-input pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by country…" aria-label="Search visas by country" /></label>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {query.isPending && Array.from({ length: 6 }, (_, index) => <div className="skeleton h-64" key={index} />)}
            {query.isError && <div className="col-span-full"><QueryError onRetry={() => query.refetch()} /></div>}
            {query.data && items.map((visa, index) => <Reveal delay={index * .04} key={visa.slug}><article className="flex h-full flex-col rounded-3xl border border-[#e8efef] bg-white p-6 shadow-[0_12px_32px_#183b4e08] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_#183b4e12]">
              <div className="flex items-start justify-between gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mist text-sm font-bold text-turquoise">{visa.code}</span><div className="flex items-center gap-2"><span className="rounded-full bg-[#f5f8f8] px-3 py-1.5 text-[10px] font-semibold text-muted">{visa.type}</span><button aria-label={isSaved('visa', visa.slug) ? 'Remove visa from wishlist' : 'Add visa to wishlist'} aria-pressed={isSaved('visa', visa.slug)} onClick={() => toggle({ type: 'visa', slug: visa.slug, title: visa.title, place: visa.country, image: null, path: `/visas/${visa.slug}` })} className="grid h-9 w-9 place-items-center rounded-full bg-mist text-coral"><Heart size={17} className={isSaved('visa', visa.slug) ? 'fill-coral' : ''} /></button></div></div>
              <h2 className="mt-5 text-lg font-semibold">{t(visa.title)}</h2><p className="mt-2 flex items-center gap-2 text-xs text-muted"><Clock3 size={14} className="text-turquoise" />{t(visa.processingTime)}</p><p className="mt-2 text-xs text-muted">{formatPrice(Number(visa.fee.match(/[\d,]+/)?.[0]?.replaceAll(',', '') || 0))} {t('sample service fee')}</p><p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">{t(visa.overview)}</p>
              <Link className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-turquoise hover:gap-3" to={`/visas/${visa.slug}`}>Visa details <ArrowRight size={15} /></Link>
            </article></Reveal>)}
            {query.data && items.length === 0 && <p className="col-span-full rounded-2xl bg-white p-8 text-center text-sm text-muted">No visa options match your search. Try another country or visa type.</p>}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="section-shell">
          <Reveal><SectionTitle eyebrow="A straightforward process" title="How visa support works." description="We help make the preparation feel clear. Applications and decisions stay with the relevant authority." /></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{visaSteps.map((step, index) => <Reveal delay={index * .05} key={step.title}><article className="h-full rounded-2xl border border-[#e8efef] p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-mist text-xs font-bold text-turquoise">{index + 1}</span><h3 className="mt-4 text-sm font-semibold">{step.title}</h3><p className="mt-2 text-xs leading-6 text-muted">{step.text}</p></article></Reveal>)}</div>
        </div>
      </section>
      <section className="section-pad">
        <div className="section-shell grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal><SectionTitle align="left" eyebrow="Be prepared" title="Common documents to get started." description="Exact requirements vary by visa, nationality, and current rules. Use this as a conversation starter, not an official checklist." /><ul className="mt-7 space-y-3">{commonDocs.map((doc) => <li className="flex gap-3 text-sm text-muted" key={doc}><span className="grid h-6 w-6 place-items-center rounded-full bg-mist text-turquoise">✓</span>{doc}</li>)}</ul></Reveal>
          <Reveal delay={.1}><h2 className="mb-5 text-xl font-semibold">Visa questions, answered.</h2><FAQAccordion items={visaFaq} /></Reveal>
        </div>
      </section>
      <section className="section-pad bg-mist"><div className="section-shell grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]"><Reveal><SectionTitle align="left" eyebrow="Let’s get you prepared" title="Tell us about your travel plans." description="A few details are all we need to point you towards the next steps. Please don’t send passport copies through this form." /></Reveal><Reveal delay={.1}><VisaRequestForm /></Reveal></div></section>
    </>
  )
}
