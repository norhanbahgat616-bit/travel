import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Photo from './Photo'
import { getImage } from '../utils/images'
import { useLanguage } from '../context/useLanguage'

function resolveImage(image, imageKey, index) {
  const source = image ?? imageKey
  if (typeof source !== 'string') return getImage('hero', index)
  if (/^(https?:|\/|data:|blob:)/i.test(source) || /\.[a-z\d]{2,5}([?#].*)?$/i.test(source)) return source
  return getImage(source, index)
}

export default function PageHeader({
  title,
  subtitle,
  image,
  imageKey = 'hero',
  index = 0,
  crumbs,
  breadcrumb = [],
  eyebrow,
  children,
}) {
  const { t, language } = useLanguage()
  const reduceMotion = useReducedMotion()
  const items = crumbs ?? breadcrumb
  const photo = resolveImage(image, imageKey, index)
  const label = eyebrow ?? items.at(-1)?.label ?? ''
  const initial = reduceMotion ? false : { opacity: 0, y: 18 }
  const animate = { opacity: 1, y: 0 }
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-mist to-bg pb-16 pt-32 md:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute -start-24 top-24 h-72 w-72 rounded-full bg-turquoise/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-16 bottom-0 h-64 w-64 rounded-full bg-sun/25 blur-3xl" />
      <div className="section-shell relative grid items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-14">
        <motion.div initial={initial} animate={animate} transition={transition} className="relative z-10 order-1">
          <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-turquoise">{t('Home')}</Link>
            {items.map((item, itemIndex) => {
              const active = itemIndex === items.length - 1
              return (
                <span className="inline-flex items-center gap-2" key={`${item.label}-${item.to || 'current'}`}>
                  <ChevronRight className={language === 'ar' ? 'rotate-180' : ''} size={13} aria-hidden="true" />
                  {item.to && !active
                    ? <Link className="transition-colors hover:text-turquoise" to={item.to}>{t(item.label)}</Link>
                    : <span aria-current={active ? 'page' : undefined} className={active ? 'font-medium text-turquoise' : ''}>{t(item.label)}</span>}
                </span>
              )
            })}
          </nav>
          {label && <span className="inline-flex max-w-full items-center rounded-full bg-turquoise/10 px-4 py-2 text-[11px] font-semibold tracking-wide text-turquoise">{t(label)}</span>}
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-[-.045em] text-navy md:text-5xl">{t(title)}</h1>
          {subtitle && <p className="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{t(subtitle)}</p>}
          {children && <div className="mt-7 flex flex-wrap items-center gap-3">{children}</div>}
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: language === 'ar' ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.08, ease: 'easeOut' }}
          className="relative order-2 mx-2 mt-2 min-w-0 lg:mx-0 lg:mt-0"
        >
          <div aria-hidden="true" className="absolute -bottom-3 -end-3 -z-10 h-[88%] w-[88%] rounded-3xl bg-turquoise sm:-bottom-4 sm:-end-4" />
          <div aria-hidden="true" className="absolute -start-3 -top-3 z-10 h-12 w-12 rounded-xl bg-sun shadow-lg sm:-start-4 sm:-top-4 sm:h-14 sm:w-14" />
          <Photo
            src={photo}
            alt={`${t(title)} in Egypt`}
            loading="eager"
            className="h-64 rounded-3xl shadow-2xl sm:h-80 lg:h-[26rem]"
          />
        </motion.div>
      </div>
    </section>
  )
}
