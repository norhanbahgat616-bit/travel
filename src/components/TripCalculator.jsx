import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { tripPricing } from '../data/pricing'
import { useDestinations } from '../hooks/useData'
import { CardSkeletons, QueryError } from './Loader'

export default function TripCalculator() {
  const destinationsQuery = useDestinations()
  const reduceMotion = useReducedMotion()
  const formatEstimate = (amount) => new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(amount)
  const [form, setForm] = useState({ destination: 'Sharm El Sheikh', nights: 4, travelers: 2, hotel: '4-star', transfer: false, guidedTour: false, visa: false })
  const destinations = destinationsQuery.data || []
  const breakdown = useMemo(() => {
    const hotel = tripPricing.hotelPerNight[form.hotel] * Number(form.nights)
    const local = tripPricing.travelerBase * Number(form.travelers) * Number(form.nights)
    const extras = Object.entries(tripPricing.addOns).reduce((total, [key, price]) => total + (form[key] ? price * Number(form.travelers) : 0), 0)
    return { hotel, local, extras, total: hotel + local + extras }
  }, [form])
  const update = (event) => {
    const { name, value, checked, type } = event.target
    const numeric = name === 'nights' ? Math.max(1, Math.min(30, Number(value) || 1)) : name === 'travelers' ? Math.max(1, Math.min(20, Number(value) || 1)) : value
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : numeric }))
  }
  const notes = `Trip estimate · ${form.destination} · ${form.nights} nights · ${form.travelers} travelers · ${form.hotel} hotel · Estimated ${formatEstimate(breakdown.total)}${form.transfer ? ' · airport transfer' : ''}${form.guidedTour ? ' · guided tour' : ''}${form.visa ? ' · visa support' : ''}`
  if (destinationsQuery.isError) return <QueryError onRetry={() => destinationsQuery.refetch()} />
  if (destinationsQuery.isPending) return <CardSkeletons count={1} className="skeleton h-80 rounded-3xl" />
  return <div className="grid gap-8 rounded-3xl border border-[#e7efef] bg-white p-6 shadow-[0_18px_50px_#183b4e0b] lg:grid-cols-[1fr_.75fr] sm:p-9">
    <div className="grid content-start gap-4 sm:grid-cols-2">
      <label className="form-field sm:col-span-2"><span className="field-label">Destination</span><select className="field-input" name="destination" value={form.destination} onChange={update}>{destinations.map((destination) => <option key={destination.slug}>{destination.name}</option>)}</select></label>
      <label className="form-field"><span className="field-label">Number of nights</span><input className="field-input" name="nights" type="number" min="1" max="30" value={form.nights} onChange={update} /></label>
      <label className="form-field"><span className="field-label">Number of travelers</span><input className="field-input" name="travelers" type="number" min="1" max="20" value={form.travelers} onChange={update} /></label>
      <label className="form-field sm:col-span-2"><span className="field-label">Hotel level</span><select className="field-input" name="hotel" value={form.hotel} onChange={update}><option value="3-star">3-star</option><option value="4-star">4-star</option><option value="5-star">5-star</option></select></label>
      <fieldset className="sm:col-span-2"><legend className="field-label">Optional add-ons</legend><div className="grid gap-3 sm:grid-cols-3">{[['transfer','Airport transfer'],['guidedTour','Guided tour'],['visa','Visa support']].map(([name,label]) => <label key={name} className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" name={name} checked={form[name]} onChange={update} />{label}</label>)}</div></fieldset>
    </div>
    <div className="flex flex-col justify-between rounded-2xl bg-mist p-6">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-turquoise">Sample estimate · EGP</p><p className="mt-3 text-sm text-muted">{form.destination} · {form.nights} nights · {form.travelers} travelers</p><motion.p key={breakdown.total} initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-3xl font-bold">{formatEstimate(breakdown.total)}</motion.p><p className="mt-1 text-xs text-muted">Estimated total, not a final offer</p>
        <dl className="mt-6 space-y-3 border-t border-[#d9e9e8] pt-5 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted">Stay</dt><dd>{formatEstimate(breakdown.hotel)}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Travel & local services</dt><dd>{formatEstimate(breakdown.local)}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Add-ons</dt><dd>{formatEstimate(breakdown.extras)}</dd></div></dl></div>
      <div className="mt-7 grid gap-3"><Link className="button-outline w-full" to={`/trips?destination=${encodeURIComponent(form.destination)}`}>Browse trips</Link><Link className="button-primary w-full" to={`/contact?subject=${encodeURIComponent(`Trip estimate for ${form.destination}`)}&message=${encodeURIComponent(notes)}`}>Request this quote</Link></div>
    </div>
  </div>
}
