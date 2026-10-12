import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Check, Heart, MapPin, Share2, Star, X } from 'lucide-react'
import { useTours } from '../hooks/useData'
import { useWishlist } from '../context/useWishlist'
import { useCurrency } from '../context/useCurrency'
import { createRecordId } from '../utils/validators'
import { useLanguage } from '../context/useLanguage'
import PageHeader from '../components/PageHeader'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import FAQAccordion from '../components/FAQAccordion'
import NotFound from './NotFound'
import { getAllImages } from '../utils/images'
import { showAlert } from '../utils/alert'
import { QueryError } from '../components/Loader'

const reviewKey = (slug) => `tgt-reviews-${slug}`
function loadReviews(slug) {
  try {
    const value = JSON.parse(localStorage.getItem(reviewKey(slug)) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export default function TourDetails() {
  const { slug } = useParams()
  const query = useTours()
  const { toggle, isSaved } = useWishlist()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [reviews, setReviews] = useState(() => loadReviews(slug))
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { rating: '5' } })
  const tour = query.data?.find((item) => item.slug === slug)
  const photos = useMemo(() => tour ? [tour.image, ...getAllImages().map((image) => image.src).filter((image) => image !== tour.image)].slice(0, 3) : [], [tour])
  if (query.isPending) return <div className="section-shell section-pad"><div className="skeleton h-80 rounded-3xl" /></div>
  if (query.isError) return <div className="section-shell section-pad"><QueryError onRetry={() => query.refetch()} /></div>
  if (!tour) return <NotFound />
  const average = reviews.length ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length : tour.rating
  const related = (query.data || []).filter((item) => item.slug !== tour.slug).slice(0, 2)
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    await showAlert({ toast: true, position: 'top-end', timer: 1500, showConfirmButton: false, icon: 'success', title: 'Link copied' })
  }
  const shareWhatsApp = (event) => {
    event.preventDefault()
    window.open(`https://wa.me/?text=${encodeURIComponent(`${tour.title}: ${window.location.href}`)}`, '_blank', 'noopener,noreferrer')
  }
  const submitReview = async (data) => {
    const next = [{ id: createRecordId('REVIEW'), name: data.name.trim(), rating: Number(data.rating), comment: data.comment.trim(), date: new Date().toISOString() }, ...reviews]
    localStorage.setItem(reviewKey(slug), JSON.stringify(next))
    setReviews(next)
    reset({ rating: '5', name: '', comment: '' })
    await showAlert({ icon: 'success', title: 'Thank you for sharing', text: 'Your review has been added.', confirmButtonColor: '#19A7A0' })
  }
  return <>
    <Helmet title={`${t(tour.title)} | Travel Golf Tours`}><meta name="description" content={t(tour.overview)} /></Helmet>
    <PageHeader title={t(tour.title)} subtitle={t(tour.overview)} imageKey={tour.place.toLowerCase().includes('dahab') ? 'dahab' : tour.place.toLowerCase().includes('hurghada') ? 'hurghada' : 'sharm'} breadcrumb={[{ label: 'Destinations', to: '/destinations' }, { label: 'Trips', to: '/trips' }, { label: t(tour.title) }]} />
    <div className="section-shell grid items-start gap-10 py-12 lg:grid-cols-[1fr_350px] lg:py-16">
      <div className="space-y-12">
        <Reveal><section aria-label="Tour photographs">
          <Photo src={photos[photoIndex]} alt={`${tour.title} photograph ${photoIndex + 1}`} className="h-[360px] rounded-3xl sm:h-[500px]" />
          <div className="mt-3 grid grid-cols-3 gap-3">{photos.map((photo, index) => <button key={`${photo}-${index}`} className={`overflow-hidden rounded-xl ring-2 ${photoIndex === index ? 'ring-turquoise' : 'ring-transparent'}`} onClick={() => setPhotoIndex(index)} aria-label={`Show photo ${index + 1}`}><Photo src={photo} alt={`${tour.title}, view ${index + 1}`} className="h-24 sm:h-32" /></button>)}</div>
          <div className="mt-5 flex flex-wrap gap-3"><button onClick={copyLink} className="button-outline min-h-10"><Share2 size={15} />{t('Share')}</button><a className="button-outline min-h-10" href="https://wa.me/" onClick={shareWhatsApp}>{t('WhatsApp')}</a></div>
        </section></Reveal>
        <Reveal><section><h2 className="text-2xl font-semibold">{t('The experience')}</h2><p className="mt-3 leading-8 text-muted">{t(tour.overview)}</p><div className="mt-4 flex items-center gap-2 text-sm"><MapPin size={16} className="text-turquoise" />{t(tour.place)}, {t('Egypt')}</div></section></Reveal>
        <Reveal><section><h2 className="text-2xl font-semibold">{t('Trip highlights')}</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{(tour.highlights || tour.included.slice(0, 4)).map((highlight) => <li key={highlight} className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-sm"><Check size={16} className="shrink-0 text-turquoise" />{t(highlight)}</li>)}</ul><div className="mt-5 flex flex-wrap gap-3 text-sm text-muted"><span>{tour.days} {t('days')}</span><span aria-hidden="true">·</span><span><Star size={14} className="me-1 inline fill-sun text-sun" />{tour.rating.toFixed(1)} / 5</span></div></section></Reveal>
        <Reveal><section><h2 className="text-2xl font-semibold">{t('Day by day')}</h2><div className="mt-5"><FAQAccordion items={tour.itinerary.map((day, index) => ({ q: `${t('Day')} ${index + 1}: ${t(day.title)}`, a: t(day.text) }))} /></div></section></Reveal>
        <Reveal><section className="grid gap-8 sm:grid-cols-2"><div><h2 className="text-xl font-semibold">{t('What’s included')}</h2><ul className="mt-4 space-y-3">{tour.included.map((item) => <li className="flex gap-2 text-sm text-muted" key={item}><Check size={17} className="shrink-0 text-turquoise" />{t(item)}</li>)}</ul></div><div><h2 className="text-xl font-semibold">{t('Not included')}</h2><ul className="mt-4 space-y-3">{tour.notIncluded.map((item) => <li className="flex gap-2 text-sm text-muted" key={item}><X size={17} className="shrink-0 text-coral" />{t(item)}</li>)}</ul></div></section></Reveal>
        <Reveal><section className="grid gap-5 rounded-3xl bg-mist p-6 sm:grid-cols-2"><div><p className="text-xs font-semibold text-turquoise">{t('Meeting point')}</p><p className="mt-2 font-medium">{t(tour.meetingPoint)}</p></div><div><p className="text-xs font-semibold text-turquoise">{t('Important notes')}</p><ul className="mt-2 space-y-1 text-sm text-muted">{tour.importantNotes.map((note) => <li key={note}>{t(note)}</li>)}</ul></div></section></Reveal>
        <Reveal><section><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold">Guest reviews</h2><p className="mt-2 flex items-center gap-1 text-sm text-muted"><Star size={16} className="fill-sun text-sun" />{average.toFixed(1)} average · {reviews.length} review{reviews.length === 1 ? '' : 's'}</p></div></div>
          <div className="mt-5 space-y-3">{reviews.map((review) => <article key={review.id} className="rounded-2xl border border-[#e7efef] bg-white p-5"><div className="flex items-center justify-between"><strong>{review.name}</strong><span aria-label={`${review.rating} out of 5 stars`} className="text-sun">{'★'.repeat(review.rating)}</span></div><p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p></article>)}{reviews.length === 0 && <p className="text-sm text-muted">Be the first to share a review of this trip.</p>}</div>
          <form className="mt-6 grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2" onSubmit={handleSubmit(submitReview)} noValidate><label className="form-field"><span className="field-label">Your name</span><input className="field-input" {...register('name', { required: 'Please enter your name.', pattern: { value: /^[A-Za-z\u0600-\u06FF\s]{3,40}$/, message: 'Enter 3–40 letters.' } })} />{errors.name && <span className="field-error">{errors.name.message}</span>}</label><label className="form-field"><span className="field-label">Rating</span><select className="field-input" {...register('rating', { required: true })}>{[5,4,3,2,1].map((number) => <option key={number} value={number}>{number} stars</option>)}</select></label><label className="form-field sm:col-span-2"><span className="field-label">Your review</span><textarea className="field-input min-h-24" {...register('comment', { required: 'Please share a few words.', pattern: { value: /^[\s\S]{10,600}$/, message: 'Write between 10 and 600 characters.' } })} />{errors.comment && <span className="field-error">{errors.comment.message}</span>}</label><button className="button-primary sm:col-span-2" disabled={isSubmitting}>Share review</button></form>
        </section></Reveal>
      </div>
      <aside className="lg:sticky lg:top-24"><div className="rounded-3xl border border-[#e7efef] bg-white p-6 shadow-xl"><p className="text-sm text-muted">Price per person</p><p className="mt-1 text-3xl font-bold">{formatPrice(tour.price)}</p><dl className="mt-5 space-y-3 border-t border-[#edf1f1] pt-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted">Duration</dt><dd className="font-medium">{tour.days} days</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Destination</dt><dd className="font-medium">{tour.place}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Guest rating</dt><dd className="inline-flex items-center gap-1 font-medium"><Star size={14} className="fill-sun text-sun" />{average.toFixed(1)}</dd></div></dl><Link className="button-primary mt-6 w-full" to={`/trips/${tour.slug}/book`}>Book Now <ArrowRight size={16} /></Link><button className="button-outline mt-3 w-full" aria-pressed={isSaved('tour', tour.slug)} onClick={() => toggle({ type: 'tour', slug: tour.slug, title: tour.title, place: tour.place, image: tour.image, path: `/trips/${tour.slug}` })}><Heart size={16} className={isSaved('tour', tour.slug) ? 'fill-coral text-coral' : ''} />{isSaved('tour', tour.slug) ? 'Saved to wishlist' : 'Add to wishlist'}</button></div></aside>
    </div>
    <section className="section-pad bg-white"><div className="section-shell"><h2 className="text-2xl font-semibold">Related trips</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{related.map((item) => <Link key={item.slug} to={`/trips/${item.slug}`} className="flex items-center gap-4 rounded-2xl border border-[#e7efef] p-4 hover:shadow-lg"><Photo src={item.image} alt={item.title} className="h-24 w-28 rounded-xl" /><span><strong>{item.title}</strong><span className="mt-1 block text-sm text-muted">{item.days} days · {formatPrice(item.price)}</span></span></Link>)}</div><Link to="/trips" className="mt-7 inline-flex items-center gap-2 text-sm text-turquoise"><ArrowLeft size={15} />All trips</Link></div></section>
  </>
}
