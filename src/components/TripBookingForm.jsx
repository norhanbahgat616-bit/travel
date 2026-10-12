import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, CalendarDays, Check } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useCurrency } from '../context/useCurrency'
import { FormField, Input, Select, Textarea } from './FormField'
import { patterns, readStoredList, saveStoredRecord, validateFutureDate, validateTravelers, validationMessages } from '../utils/validators'
import { showAlert } from '../utils/alert'
import Photo from './Photo'

function nextBookingReference() {
  const year = new Date().getFullYear()
  const highestSaved = readStoredList('bookings').reduce((highest, record) => {
    const match = record.id?.match(new RegExp(`^TGT-${year}-(\\d{4})$`))
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 0)
  const sequenceKey = `tgt-booking-sequence-${year}`
  const sequence = Math.max(highestSaved, Number(localStorage.getItem(sequenceKey)) || 0) + 1
  localStorage.setItem(sequenceKey, String(sequence))
  return `TGT-${year}-${String(sequence).padStart(4, '0')}`
}

export default function TripBookingForm({ trip }) {
  const { user } = useAuth()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const search = new URLSearchParams(location.search)
  const requestedNights = Number(search.get('nights') || location.state?.nights)
  const quoteNights = Number.isInteger(requestedNights) && requestedNights >= 1 && requestedNights <= 30 ? String(requestedNights) : ''
  const requestedHotel = search.get('hotel') || location.state?.hotel || ''
  const quoteHotel = ['3-star', '4-star', '5-star'].includes(requestedHotel) ? requestedHotel : ''
  const requestedTravelers = Number(search.get('travelers') || location.state?.travelers)
  const quoteTravelers = Number.isInteger(requestedTravelers) && requestedTravelers >= 1 && requestedTravelers <= 20 ? requestedTravelers : 2
  const quoteNote = quoteNights ? `Calculator estimate: ${quoteNights} nights, ${quoteHotel || 'selected'} hotel.` : ''
  const { control, register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      date: '',
      travelers: quoteTravelers,
      preference: quoteHotel === '5-star' ? 'VIP' : quoteHotel === '3-star' ? 'Standard' : 'Comfort',
      requests: quoteNote,
    },
  })
  const travelers = Number(useWatch({ control, name: 'travelers' }) || 1)
  const total = trip.price * travelers

  useEffect(() => {
    if (user?.name) setValue('name', user.name)
    if (user?.email) setValue('email', user.email)
  }, [user, setValue])

  const submit = async (data) => {
    const reference = nextBookingReference()
    const booking = {
      id: reference,
      type: 'trip',
      tripSlug: trip.slug,
      tripTitle: trip.title,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      destination: trip.place,
      date: data.date,
      travelers: Number(data.travelers),
      preference: data.preference,
      notes: data.requests?.trim() || '',
      nights: quoteNights ? Number(quoteNights) : undefined,
      hotelLevel: quoteHotel || undefined,
      pricePerPerson: trip.price,
      estimatedTotal: trip.price * Number(data.travelers),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    saveStoredRecord('bookings', booking)
    queryClient.setQueryData(['bookings'], (current = []) => [booking, ...current.filter((item) => item.id !== booking.id)])
    await showAlert({
      icon: 'success',
      title: 'Trip request received',
      text: `Your request for ${trip.title} has been saved. Reference: ${reference}`,
      confirmButtonColor: '#19A7A0',
    })
    navigate(`/trips/${trip.slug}/booked?ref=${encodeURIComponent(reference)}`, { state: { booking } })
  }

  return (
    <div className="section-shell grid items-start gap-8 py-12 lg:grid-cols-[1fr_390px] lg:gap-12 lg:py-16">
      <form className="rounded-3xl border border-[#e7efef] bg-white p-6 shadow-[0_18px_55px_#183b4e12] sm:p-9" onSubmit={handleSubmit(submit)} noValidate>
        <p className="eyebrow">Trip request</p>
        <h2 className="mt-2 text-2xl font-semibold">Tell us about your travelers.</h2>
        <p className="mt-2 text-sm leading-6 text-muted">This request is free and does not require payment.</p>
        <div className="mt-7 grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <FormField label="Selected trip" className="sm:col-span-2"><div className="field-input flex items-center bg-mist font-semibold" aria-readonly="true">{trip.title} · {trip.place}</div></FormField>
          <FormField label="Full name" error={errors.name?.message}>{(id) => <Input id={id} autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name', { required: 'Please enter your name.', pattern: { value: patterns.name, message: validationMessages.name } })} />}</FormField>
          <FormField label="Email address" error={errors.email?.message}>{(id) => <Input id={id} type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Please enter your email.', pattern: { value: patterns.email, message: validationMessages.email } })} />}</FormField>
          <FormField label="Phone number" error={errors.phone?.message}>{(id) => <Input id={id} type="tel" inputMode="numeric" autoComplete="tel" placeholder="01012345678" aria-invalid={Boolean(errors.phone)} {...register('phone', { required: 'Please enter your phone number.', pattern: { value: patterns.phone, message: validationMessages.phone } })} />}</FormField>
          <FormField label="Preferred travel date" error={errors.date?.message}>{(id) => <Input id={id} type="date" min={new Date().toISOString().split('T')[0]} aria-invalid={Boolean(errors.date)} {...register('date', { validate: validateFutureDate })} />}</FormField>
          <FormField label="Number of travelers" error={errors.travelers?.message}>{(id) => <Input id={id} type="number" min="1" max="20" step="1" aria-invalid={Boolean(errors.travelers)} {...register('travelers', { validate: validateTravelers })} />}</FormField>
          <FormField label="Room / transport preference" error={errors.preference?.message}>{(id) => <Select id={id} {...register('preference', { required: 'Please choose a preference.' })}><option value="Standard">Standard</option><option value="Comfort">Comfort</option><option value="VIP">VIP</option></Select>}</FormField>
          <FormField label="Special requests (optional)" className="sm:col-span-2">{(id) => <Textarea id={id} rows="4" placeholder="Anything you would like our local team to know?" {...register('requests')} />}</FormField>
        </div>
        <button className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending request…' : 'Request this trip'} {!isSubmitting && <ArrowRight size={17} />}</button>
        <p className="mt-3 text-center text-xs text-muted">No payment is collected when you send a request.</p>
      </form>

      <aside className="lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-3xl border border-[#e7efef] bg-white shadow-xl">
          <Photo src={trip.image} alt={`${trip.title} in ${trip.place}`} className="h-52" />
          <div className="p-6">
            <p className="text-xs font-semibold text-turquoise">YOUR TRIP</p>
            <h2 className="mt-2 text-xl font-semibold">{trip.title}</h2>
            <p className="mt-1 text-sm text-muted">{trip.place} · {trip.days} days</p>
            {quoteNights && <p className="mt-2 text-xs text-muted">Calculator quote: {quoteNights} nights · {quoteHotel}</p>}
            <dl className="mt-5 space-y-3 border-t border-[#edf1f1] pt-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted">Price per person</dt><dd className="font-semibold">{formatPrice(trip.price)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Travelers</dt><dd className="font-semibold">{travelers}</dd></div>
              <div className="flex items-start justify-between gap-4 border-t border-[#edf1f1] pt-3"><dt className="font-semibold">Estimated total</dt><dd className="text-right text-lg font-bold text-turquoise">{formatPrice(total)}</dd></div>
            </dl>
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-mist px-3 py-3 text-xs font-medium text-navy"><Check size={15} className="shrink-0 text-turquoise" />Free to request, no payment now</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted"><CalendarDays size={14} />Your dates are confirmed with our team.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
