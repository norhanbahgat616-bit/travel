import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, MapPin, Phone, Clock3, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import { FormField, Input, Textarea } from '../components/FormField'
import { patterns, validateMessage, validationMessages } from '../utils/validators'
import { showAlert } from '../utils/alert'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { subject: searchParams.get('subject') || '', message: searchParams.get('message') || '' } })
  const submit = async (data) => {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    await showAlert({ icon: 'success', title: 'Message received', text: `Thanks ${data.name.split(' ')[0]} — we’ll get back to you soon.`, confirmButtonColor: '#19A7A0' })
    reset()
  }
  return (
    <>
      <Helmet><title>Contact | Travel Golf Tours</title><meta name="description" content="Contact the Travel Golf Tours team in Egypt for help planning a trip." /></Helmet>
      <PageHeader title="Let’s talk about Egypt." subtitle="Questions, ideas, or just curious about what’s possible? Our local team is right here." imageKey="contact" breadcrumb={[{ label: 'Contact' }]} />
      <section className="section-pad">
        <div className="section-shell">
          <Reveal><SectionTitle eyebrow="We’re just a hello away" title="Get in touch with our local team." description="Tell us what you’re thinking. We’ll help you find a good place to start." /></Reveal>
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { Icon: Phone, label: 'Call our team', text: '010 155 411 20', href: 'tel:01015541120' },
                { Icon: Mail, label: 'Write to us', text: 'info@travelgolftours.com', href: 'mailto:info@travelgolftours.com' },
                { Icon: MapPin, label: 'Made local', text: 'Egypt', href: null },
                { Icon: Clock3, label: 'Here when you need us', text: 'Daily Support', href: null },
              ].map(({ Icon, label, text, href }) => {
                const content = <><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-turquoise"><Icon size={20} /></span><span><span className="block text-xs text-muted">{label}</span><span className="mt-1 block break-all text-sm font-semibold">{text}</span></span></>
                return href ? <a key={label} href={href} className="flex items-center gap-4 rounded-2xl border border-[#e7efef] bg-white p-5 transition hover:border-turquoise/40 hover:shadow-lg">{content}</a> : <div key={label} className="flex items-center gap-4 rounded-2xl border border-[#e7efef] bg-white p-5">{content}</div>
              })}
            </Reveal>
            <Reveal delay={.1}>
              <form className="rounded-3xl bg-white p-7 shadow-[0_14px_44px_#183b4e0b] sm:p-9" onSubmit={handleSubmit(submit)} noValidate>
                <h2 className="text-xl font-semibold">Send us a note</h2><p className="mb-6 mt-2 text-sm text-muted">We’ll get back to you as soon as we can.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Your name" error={errors.name?.message}>{(id) => <Input id={id} placeholder="Your name" {...register('name', { required: 'Please enter your name.', pattern: { value: patterns.name, message: validationMessages.name } })} />}</FormField>
                  <FormField label="Email address" error={errors.email?.message}>{(id) => <Input id={id} type="email" placeholder="you@example.com" {...register('email', { required: 'Please enter your email.', pattern: { value: patterns.email, message: validationMessages.email } })} />}</FormField>
                    <FormField label="Subject" error={errors.subject?.message} className="sm:col-span-2">{(id) => <Input id={id} placeholder="How can we help?" {...register('subject', { required: 'Please enter a subject.' })} />}</FormField>
                  <FormField label="Message" error={errors.message?.message} className="sm:col-span-2">{(id) => <Textarea id={id} placeholder="What’s on your mind?" {...register('message', { required: 'Please write a message.', validate: validateMessage })} />}</FormField>
                </div>
                <button type="submit" className="button-primary mt-5 disabled:opacity-60" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'} <Send size={15} /></button>
                  <p className="mt-5 text-xs text-muted">Want to book a trip? <Link className="font-semibold text-turquoise underline" to="/trips">Browse trips</Link>.</p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section-shell pb-20"><div className="overflow-hidden rounded-3xl border border-[#e7efef] bg-white"><iframe title="Map showing Egypt" loading="lazy" className="h-72 w-full border-0 sm:h-96" src="https://www.openstreetmap.org/export/embed.html?bbox=24.5%2C22%2C36.9%2C31.7&amp;layer=mapnik&amp;marker=26.8206%2C30.8025" /></div></section>
    </>
  )
}
