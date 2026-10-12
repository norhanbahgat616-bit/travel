import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import FAQAccordion from '../components/FAQAccordion'

const faqData = [
  { category: 'Booking', q: 'How do I request a trip plan?', a: 'Use the booking form to share your dates and preferences. Our local team will follow up to discuss options.' },
  { category: 'Booking', q: 'Can I request a private itinerary?', a: 'Yes. Share your interests and group details in the booking form and we can discuss a tailored plan.' },
  { category: 'Payments', q: 'Are prices on the website final?', a: 'No. Prices shown are sample estimates. We confirm availability and a final quote before you make a booking.' },
  { category: 'Payments', q: 'When do I pay for a trip?', a: 'Payment terms depend on the confirmed itinerary and will be provided with your quote.' },
  { category: 'Visas', q: 'Can you guarantee my visa will be approved?', a: 'No. Visa decisions are made by the relevant government authority. We provide application preparation guidance.' },
  { category: 'Visas', q: 'Should I send a passport copy through your forms?', a: 'No. Never upload or send passport copies through our website forms.' },
  { category: 'Travel', q: 'What should I pack for the Red Sea?', a: 'Light clothing, sun protection, comfortable shoes, and swimwear are useful. Check the season-specific forecast.' },
  { category: 'Travel', q: 'Can you help with airport transfers?', a: 'Yes, transfer arrangements can be included in a trip plan on request.' },
]
const categories = ['All', 'Booking', 'Payments', 'Visas', 'Travel']
export default function FAQ() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => faqData.filter((item) => (category === 'All' || item.category === category) && `${item.q} ${item.a}`.toLowerCase().includes(search.toLowerCase())), [category, search])
  const grouped = categories.slice(1).map((name) => ({ name, items: filtered.filter((item) => item.category === name) })).filter((group) => group.items.length)
  return <>
    <Helmet><title>Frequently Asked Questions | Travel Golf Tours</title><meta name="description" content="Answers to common Travel Golf Tours booking, payment, visa, and travel questions." /></Helmet>
    <PageHeader title="Good questions, clear answers." subtitle="Find a helpful place to start. If you need a hand, our local team is always here." imageKey="contact" breadcrumb={[{ label: 'FAQ' }]} />
    <section className="section-pad"><div className="section-shell max-w-4xl"><label className="relative block"><Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" size={17} /><input className="field-input ps-11" aria-label="Search frequently asked questions" placeholder="Search questions…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className="mt-5 flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${category === item ? 'bg-turquoise text-white' : 'bg-white text-muted ring-1 ring-[#e7efef]'}`}>{item}</button>)}</div><div className="mt-10 space-y-10">{grouped.map((group) => <section key={group.name}><h2 className="mb-4 text-xl font-semibold">{group.name}</h2><FAQAccordion items={group.items.map(({ q, a }) => ({ q, a }))} /></section>)}{grouped.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted">No questions match your search.</p>}</div></div></section>
  </>
}
