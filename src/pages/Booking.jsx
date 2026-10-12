import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Check, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import { FormField, Input, Select, Textarea } from '../components/FormField'
import { useDestinations } from '../hooks/useData'
import { createRecordId, patterns, saveStoredRecord, validateFutureDate, validateTravelers, validationMessages } from '../utils/validators'
import { showAlert } from '../utils/alert'

export default function Booking() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const preferredDestination = searchParams.get('destination') || ''
  const quoteNotes = searchParams.get('notes') || ''
  const [completedBooking, setCompletedBooking] = useState(null)
  const { data: destinations = [] } = useDestinations()
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues: { destination: preferredDestination, travelers: 2, notes: quoteNotes } })
  useEffect(() => {
    if (preferredDestination && destinations.some((destination) => destination.name === preferredDestination)) setValue('destination', preferredDestination)
  }, [destinations, preferredDestination, setValue])
  useEffect(() => {
    if (quoteNotes) setValue('notes', quoteNotes)
  }, [quoteNotes, setValue])

  const submit = async (details) => {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    const booking = {
      id: createRecordId('TGT'),
      name: details.name.trim(),
      email: details.email.trim().toLowerCase(),
      phone: details.phone,
      destination: details.destination,
      date: details.date,
      travelers: Number(details.travelers),
      notes: details.notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }
    saveStoredRecord('bookings', booking)
    queryClient.setQueryData(['bookings'], (current = []) => [booking, ...current])
    setCompletedBooking(booking)
    await showAlert({ icon: 'success', title: 'Trip request received', text: `Thanks ${details.name.split(' ')[0]}. We’ll be in touch to plan your ${details.destination} trip.`, confirmButtonColor: '#19A7A0' })
    reset({ destination: preferredDestination, travelers: 2, notes: quoteNotes })
  }

  return (
    <>
      <Helmet><title>Plan a Trip | Travel Golf Tours</title><meta name="description" content="Tell Travel Golf Tours about your ideal Egypt trip and get a personal travel plan." /></Helmet>
      <PageHeader title="Let’s plan your Egypt." subtitle="Tell us what a perfect trip looks like. Our local team will put together a thoughtful plan, made just for you." imageKey="booking" breadcrumb={[{ label: 'Booking' }]} />
      <section className="section-pad">
        <div className="section-shell grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionTitle align="left" eyebrow="Start planning" title="Your next chapter starts with a hello." description="No commitment, no pressure. Just a conversation about where you’d like to go and what you’d love to experience." />
            <div className="mt-8 space-y-4 text-sm text-muted"><p className="flex items-center gap-3"><Check className="text-turquoise" size={17} /> Personal trip planning</p><p className="flex items-center gap-3"><Check className="text-turquoise" size={17} /> Local support from first hello</p><p className="flex items-center gap-3"><Check className="text-turquoise" size={17} /> No obligation to book</p></div>
            <a className="mt-8 inline-flex items-center gap-3 font-semibold text-navy" href="tel:01015541120"><span className="grid h-11 w-11 place-items-center rounded-full bg-mist text-turquoise"><Phone size={18} /></span>010 155 411 20</a>
          </Reveal>
          <Reveal delay={.1}>
            <form className="rounded-3xl bg-white p-6 shadow-[0_18px_55px_#183b4e12] sm:p-9" onSubmit={handleSubmit(submit)} noValidate>
              <h2 className="mb-6 text-xl font-semibold">Tell us about your trip</h2>
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <FormField label="Your name" error={errors.name?.message}>{(id) => <Input id={id} placeholder="e.g. Sara Ahmed" {...register('name', { required: 'Please enter your name.', pattern: { value: patterns.name, message: validationMessages.name } })} />}</FormField>
                <FormField label="Email address" error={errors.email?.message}>{(id) => <Input id={id} type="email" placeholder="you@example.com" {...register('email', { required: 'Please enter your email.', pattern: { value: patterns.email, message: validationMessages.email } })} />}</FormField>
                <FormField label="Phone number" error={errors.phone?.message}>{(id) => <Input id={id} type="tel" inputMode="numeric" placeholder="01012345678" {...register('phone', { required: 'Please enter your phone number.', pattern: { value: patterns.phone, message: validationMessages.phone } })} />}</FormField>
                <FormField label="Destination" error={errors.destination?.message}>{(id) => <Select id={id} {...register('destination', { required: 'Choose a destination.' })}><option value="">Select a destination</option>{destinations.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}</Select>}</FormField>
                <FormField label="Travel date" error={errors.date?.message}>{(id) => <Input id={id} type="date" min={new Date().toISOString().split('T')[0]} {...register('date', { validate: validateFutureDate })} />}</FormField>
                <FormField label="Travelers" error={errors.travelers?.message}>{(id) => <Input id={id} type="number" min="1" max="20" {...register('travelers', { validate: validateTravelers })} />}</FormField>
                <FormField label="Notes" className="sm:col-span-2">{(id) => <Textarea id={id} placeholder="A special occasion, places you’d love to see, or anything else we should know." {...register('notes')} />}</FormField>
              </div>
              <button type="submit" className="button-primary mt-6 w-full disabled:opacity-60" disabled={isSubmitting}>{isSubmitting ? 'Sending your request…' : 'Send my trip request'} {!isSubmitting && <ArrowRight size={17} />}</button>
              <p className="mt-3 text-center text-xs text-muted">We’ll only use your details to follow up about this request.</p>
            </form>
          </Reveal>
        </div>
      </section>
      {completedBooking && <section className="print-summary section-shell mb-16 rounded-3xl border border-[#e7efef] bg-white p-7 shadow-lg"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Request received</p><h2 className="mt-2 text-2xl font-semibold">Your trip request summary</h2><p className="mt-2 text-sm text-muted">Reference {completedBooking.id}</p></div><button className="button-primary print-hidden" onClick={() => window.print()}>Download / Print</button></div><dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted">Traveler</dt><dd className="font-semibold">{completedBooking.name}</dd></div><div><dt className="text-muted">Destination</dt><dd className="font-semibold">{completedBooking.destination}</dd></div><div><dt className="text-muted">Travel date</dt><dd className="font-semibold">{completedBooking.date || 'To be confirmed'}</dd></div><div><dt className="text-muted">Travelers</dt><dd className="font-semibold">{completedBooking.travelers}</dd></div></dl></section>}
    </>
  )
}
