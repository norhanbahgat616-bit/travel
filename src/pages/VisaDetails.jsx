import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { Check, Clock3, FileText, Layers3, Heart, Share2 } from 'lucide-react'
import { useWishlist } from '../context/useWishlist'
import { useCurrency } from '../context/useCurrency'
import { showAlert } from '../utils/alert'
import { useLanguage } from '../context/useLanguage'
import { useVisas } from '../hooks/useData'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import FAQAccordion from '../components/FAQAccordion'
import VisaRequestForm from '../components/VisaRequestForm'
import { CardSkeletons, QueryError } from '../components/Loader'
import NotFound from './NotFound'

export default function VisaDetails() {
  const { slug } = useParams()
  const query = useVisas()
  const { isSaved, toggle } = useWishlist()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  if (query.isPending) return <div className="section-shell section-pad"><CardSkeletons count={3} className="grid gap-5 md:grid-cols-3" /></div>
  if (query.isError) return <div className="section-shell section-pad"><QueryError onRetry={() => query.refetch()} /></div>
  const visa = query.data?.find((item) => item.slug === slug)
  if (!visa) return <NotFound />
  const others = query.data.filter((item) => item.slug !== visa.slug).slice(0, 3)
  const feeAmount = Number(visa.fee.match(/[\d,]+/)?.[0]?.replaceAll(',', '') || 0)
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    await showAlert({ toast: true, position: 'top-end', timer: 1500, showConfirmButton: false, icon: 'success', title: 'Link copied' })
  }
  const shareWhatsApp = (event) => {
    event.preventDefault()
    window.open(`https://wa.me/?text=${encodeURIComponent(`${visa.title}: ${window.location.href}`)}`, '_blank', 'noopener,noreferrer')
  }
  const stats = [
    { Icon: Clock3, label: t('Processing time'), value: t(visa.processingTime) },
    { Icon: Clock3, label: t('Validity'), value: t(visa.validity) },
    { Icon: Layers3, label: t('Entries'), value: t(visa.entries) },
    { Icon: FileText, label: 'Sample service fee', value: formatPrice(feeAmount) },
  ]
  return (
    <>
      <Helmet title={`${t(visa.title)} | Travel Golf Tours`}><meta name="description" content={t(`Learn about sample ${visa.country} visa application guidance, common requirements, and request a consultation.`)} /></Helmet>
      <PageHeader title={t(visa.title)} subtitle={t(visa.overview)} imageKey={visa.slug === 'turkey' ? 'turkey' : visa.slug === 'uae-dubai' ? 'dubai' : visa.slug === 'saudi-arabia' ? 'umrah' : visa.slug === 'schengen' ? 'europe' : visa.slug === 'united-kingdom' ? 'london' : 'usa'} breadcrumb={[{ label: 'Visas', to: '/visas' }, { label: t(visa.country) }]} />
      <div className="section-shell grid items-start gap-10 py-14 lg:grid-cols-[1fr_360px] lg:gap-16 lg:py-20">
        <div className="space-y-12">
          <div className="flex gap-3"><button className="button-outline min-h-10" onClick={copyLink}><Share2 size={15} />Share</button><a className="button-outline min-h-10" href="https://wa.me/" onClick={shareWhatsApp}>WhatsApp</a></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(({ Icon, label, value }) => <Reveal key={label}><div className="h-full rounded-2xl border border-[#e8efef] bg-white p-4 sm:p-5"><Icon className="text-turquoise" size={18} /><p className="mt-4 text-[10px] text-muted">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div></Reveal>)}</div>
          <Reveal><SectionTitle align="left" eyebrow="Understand your route" title="A clearer way to prepare." description={t(visa.overview)} /></Reveal>
          <Reveal><h2 className="text-2xl font-semibold">{t('Common requirements')}</h2><p className="mt-2 text-sm leading-7 text-muted">{t('Requirements depend on your nationality and circumstances. Verify the current list with the issuing authority.')}</p><ul className="mt-5 space-y-3">{visa.requirements.map((item) => <li className="flex gap-3 text-sm leading-6 text-muted" key={item}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-turquoise"><Check size={14} /></span>{t(item)}</li>)}</ul></Reveal>
          <Reveal><h2 className="text-2xl font-semibold">{t('Application steps')}</h2><div className="mt-5 space-y-4">{['Confirm your route and requirements with the official authority.', 'Prepare the information and documents requested for your application.', 'Complete the application and pay the required official fees.', 'Attend an appointment or provide biometrics if requested.', 'Follow the official status updates and await a decision.'].map((step, index) => <div className="flex gap-4" key={step}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-turquoise text-xs font-bold text-white">{index + 1}</span><p className="pt-1 text-sm leading-6 text-muted">{t(step)}</p></div>)}</div></Reveal>
          <Reveal><h2 className="text-2xl font-semibold">{t('A few useful tips')}</h2><ul className="mt-5 space-y-3">{visa.tips.map((tip) => <li className="rounded-xl bg-mist px-4 py-3 text-sm leading-6 text-muted" key={tip}>{t(tip)}</li>)}</ul></Reveal>
          <Reveal><h2 className="mb-5 text-2xl font-semibold">{t('Frequently asked questions')}</h2><FAQAccordion items={visa.faq.map((item) => ({ q: t(item.q), a: t(item.a) }))} /></Reveal>
        </div>
        <aside className="lg:sticky lg:top-24"><VisaRequestForm visa={visa} compact /><button className="button-outline mt-3 w-full" aria-pressed={isSaved('visa', visa.slug)} onClick={() => toggle({ type: 'visa', slug: visa.slug, title: visa.title, place: visa.country, path: `/visas/${visa.slug}` })}><Heart size={16} className={isSaved('visa', visa.slug) ? 'fill-coral text-coral' : ''} />{isSaved('visa', visa.slug) ? 'Saved to wishlist' : 'Add to wishlist'}</button></aside>
      </div>
      <section className="section-pad bg-white"><div className="section-shell"><Reveal><SectionTitle eyebrow="Keep exploring" title="Other visa guides" /></Reveal><div className="mt-10 grid gap-4 md:grid-cols-3">{others.map((item) => <Link key={item.slug} to={`/visas/${item.slug}`} className="rounded-2xl border border-[#e8efef] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="grid h-10 w-10 place-items-center rounded-xl bg-mist text-xs font-bold text-turquoise">{item.code}</span><h3 className="mt-4 font-semibold">{item.title}</h3><p className="mt-1 text-xs text-muted">{item.processingTime}</p></Link>)}</div></div></section>
      <p className="section-shell pb-8 text-xs leading-6 text-muted">Sample processing estimates and service fees are indicative only. Requirements, fees, and times may change without notice. Always check the official immigration or consular source. Travel Golf Tours does not guarantee visa outcomes.</p>
    </>
  )
}
