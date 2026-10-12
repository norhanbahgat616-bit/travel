import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { FormField, Input, Select } from './FormField'
import { createRecordId, patterns, saveStoredRecord, validateFutureDate, validateTravelers, validationMessages } from '../utils/validators'
import { useVisas } from '../hooks/useData'
import { QueryError } from './Loader'
import { showAlert } from '../utils/alert'

export default function VisaRequestForm({ visa, compact = false }) {
  const queryClient = useQueryClient()
  const visasQuery = useVisas()
  const visaOptions = visasQuery.data || []
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { visaSlug: visa?.slug || '', applicants: 1 },
  })
  useEffect(() => {
    setValue('visaSlug', visa?.slug || '')
  }, [setValue, visa?.slug])

  const submit = async (details) => {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    const selected = visaOptions.find((item) => item.slug === details.visaSlug)
    const request = {
      id: createRecordId('VISA'),
      name: details.name.trim(),
      email: details.email.trim().toLowerCase(),
      phone: details.phone,
      visaSlug: selected?.slug || '',
      visaTitle: selected?.title || '',
      visaType: selected?.type || '',
      travelDate: details.travelDate,
      applicants: Number(details.applicants),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }
    saveStoredRecord('visaRequests', request)
    queryClient.setQueryData(['visaRequests'], (current = []) => [request, ...current])
    await showAlert({
      icon: 'success',
      title: 'Request received',
      text: `Thanks ${details.name.split(' ')[0]}. Our team will contact you about your visa request.`,
      confirmButtonColor: '#19A7A0',
    })
    reset({ visaSlug: visa?.slug || '', applicants: 1 })
  }

  if (visasQuery.isError) return <QueryError onRetry={() => visasQuery.refetch()} />

  return (
    <form className={`rounded-3xl bg-white p-6 shadow-[0_16px_48px_#183b4e12] sm:p-7 ${compact ? '' : 'border border-[#edf1f1]'}`} onSubmit={handleSubmit(submit)} noValidate>
      <div className="mb-6">
        <p className="eyebrow">Visa request</p>
        <h2 className="mt-2 text-xl font-semibold">{visa ? `Apply for ${visa.country}` : 'Tell us about your plans'}</h2>
        <p className="mt-2 text-xs leading-6 text-muted">We’ll help you understand the next steps. Never send passport copies through this form.</p>
      </div>
      <div className="grid gap-4">
        <FormField label="Full name" error={errors.name?.message}>{(id) => <Input id={id} placeholder="e.g. Sara Ahmed" {...register('name', { required: 'Please enter your name.', pattern: { value: patterns.name, message: validationMessages.name } })} />}</FormField>
        <FormField label="Email address" error={errors.email?.message}>{(id) => <Input id={id} type="email" placeholder="you@example.com" {...register('email', { required: 'Please enter your email.', pattern: { value: patterns.email, message: validationMessages.email } })} />}</FormField>
        <FormField label="Egyptian mobile number" error={errors.phone?.message}>{(id) => <Input id={id} type="tel" inputMode="numeric" placeholder="01012345678" {...register('phone', { required: 'Please enter your phone number.', pattern: { value: patterns.phone, message: validationMessages.phone } })} />}</FormField>
        <FormField label="Visa type" error={errors.visaSlug?.message}>{(id) => visa ? <><Select id={id} value={visa.slug} disabled aria-invalid={Boolean(errors.visaSlug)}><option value={visa.slug}>{visa.title}</option></Select><input type="hidden" {...register('visaSlug', { required: 'Please choose a visa.' })} /></> : <Select id={id} disabled={visasQuery.isPending} {...register('visaSlug', { required: 'Please choose a visa.' })}><option value="">{visasQuery.isPending ? 'Loading visa options…' : 'Choose a visa'}</option>{visaOptions.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</Select>}</FormField>
        <FormField label="Planned travel date" error={errors.travelDate?.message}>{(id) => <Input id={id} type="date" min={new Date().toISOString().split('T')[0]} {...register('travelDate', { validate: validateFutureDate })} />}</FormField>
        <FormField label="Applicants" error={errors.applicants?.message}>{(id) => <Input id={id} type="number" min="1" max="20" {...register('applicants', { validate: validateTravelers })} />}</FormField>
      </div>
      <button type="submit" className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>{isSubmitting ? 'Sending request…' : 'Request visa guidance'} {!isSubmitting && <ArrowRight size={16} />}</button>
    </form>
  )
}
