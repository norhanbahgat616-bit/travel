import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { useServices } from '../hooks/useData'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import FAQAccordion from '../components/FAQAccordion'
import ServiceCard from '../components/ServiceCard'
import { CardSkeletons, QueryError } from '../components/Loader'
import NotFound from './NotFound'
import { useLanguage } from '../context/useLanguage'

export default function ServiceDetails() {
  const { slug } = useParams()
  const query = useServices()
  const { t } = useLanguage()
  if (query.isPending) return <div className="section-shell section-pad"><CardSkeletons count={3} className="grid gap-5 md:grid-cols-3" /></div>
  if (query.isError) return <div className="section-shell section-pad"><QueryError onRetry={() => query.refetch()} /></div>
  const service = query.data?.find((item) => item.slug === slug)
  if (!service) return <NotFound />
  const others = query.data.filter((item) => item.slug !== service.slug).slice(0, 3)
  return (
    <>
      <Helmet title={`${t(service.title)} | Travel Golf Tours`}><meta name="description" content={t(service.text)} /></Helmet>
      <PageHeader title={t(service.title)} subtitle={t(service.text)} imageKey={service.imageKey} breadcrumb={[{ label: 'Services', to: '/services' }, { label: t(service.title) }]} />
      <div className="section-shell grid items-start gap-10 py-16 lg:grid-cols-[1fr_340px] lg:gap-16 lg:py-20">
        <div className="space-y-14">
          <Reveal><SectionTitle align="left" eyebrow="A little more ease" title="The thoughtful way to get there." description={t(service.overview)} /></Reveal>
          <Reveal><h2 className="text-2xl font-semibold">{t('What’s included')}</h2><ul className="mt-6 grid gap-4 sm:grid-cols-2">{service.features.map((feature) => <li className="flex gap-3 text-sm leading-6 text-muted" key={feature}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-turquoise"><Check size={14} /></span>{t(feature)}</li>)}</ul></Reveal>
          <Reveal><h2 className="text-2xl font-semibold">{t('How it works')}</h2><div className="mt-6 space-y-5">{service.steps.map((step, index) => <div key={step.title} className="flex gap-4 rounded-2xl border border-[#edf1f1] bg-white p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-sm font-bold text-turquoise">{String(index + 1).padStart(2, '0')}</span><div><h3 className="font-semibold">{t(step.title)}</h3><p className="mt-1 text-sm leading-6 text-muted">{t(step.text)}</p></div></div>)}</div></Reveal>
          <Reveal><h2 className="mb-6 text-2xl font-semibold">{t('A few common questions')}</h2><FAQAccordion items={service.faq.map((item) => ({ q: t(item.q), a: t(item.a) }))} /></Reveal>
        </div>
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl bg-white p-6 shadow-[0_16px_48px_#183b4e12]">
            <p className="eyebrow">{t('Start with a conversation')}</p><p className="mt-2 text-xl font-semibold">{t(service.price)}</p><p className="mt-2 text-sm leading-6 text-muted">{t('Tell us what you have in mind and our local team will help with the next step.')}</p>
            <Link className="button-primary mt-6 w-full" to={service.slug === 'visa-support' ? '/visas' : '/trips'}>{t(service.cta)} <ArrowRight size={16} /></Link>
            <a href="tel:01015541120" className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-navy"><Phone size={16} className="text-turquoise" />010 155 411 20</a>
          </div>
        </aside>
      </div>
      <section className="section-pad bg-white"><div className="section-shell"><Reveal><SectionTitle eyebrow="More ways to travel well" title="Other services" /></Reveal><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{others.map((item, index) => <ServiceCard service={item} index={index} key={item.slug} />)}</div></div></section>
    </>
  )
}
