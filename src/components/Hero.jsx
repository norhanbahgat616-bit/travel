import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Photo from './Photo'
import { getImage } from '../utils/images'
import { useLanguage } from '../context/useLanguage'

const slides = [
  { image: getImage('sharm', 0), location: 'Sharm El Sheikh', title: 'Find your blue in Egypt.', subtitle: 'Where the desert meets the sea, and every day feels like it was made for you.' },
  { image: getImage('dahab', 1), location: 'Dahab, South Sinai', title: 'Make room for wonder.', subtitle: 'Trade the rush for salt air, mountain mornings, and a coastline all your own.' },
  { image: getImage('hurghada', 2), location: 'The Red Sea', title: 'A little closer to paradise.', subtitle: 'Clear-water days and thoughtful little details, all taken care of by our local team.' },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const { t } = useLanguage()

  useEffect(() => {
    if (reduceMotion) return undefined
    const interval = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000)
    return () => window.clearInterval(interval)
  }, [reduceMotion])

  const slide = slides[active]
  return (
    <section id="home" className="relative isolate flex min-h-[720px] h-[100svh] max-h-[980px] items-center overflow-hidden bg-navy">
      <AnimatePresence mode="sync">
        <motion.div
          key={active}
          className="absolute inset-0 -z-20"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.25 }}
        >
          <Photo src={slide.image} alt={`${slide.location} coastline in Egypt`} loading="eager" className="h-full w-full" />
        </motion.div>
      </AnimatePresence>
      <div className="hero-overlay absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,39,53,.84)_0%,rgba(15,39,53,.61)_46%,rgba(15,39,53,.08)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102b3b]/50 via-transparent to-[#102b3b]/20" />
      <div className="section-shell pb-10 pt-28 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-[760px]"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.15em] backdrop-blur-sm"><MapPin size={14} className="text-sun" />{slide.location}</span>
            <h1 className="max-w-3xl text-[clamp(3.25rem,8vw,6.6rem)] font-semibold leading-[1.04] tracking-[-.065em]">{t(slide.title)}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">{t(slide.subtitle)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="button-primary min-h-[56px] bg-turquoise px-7 text-white" to="/trips">{t('Start planning')} <ArrowRight size={17} /></Link>
              <Link className="button-light min-h-[56px] bg-white/10 text-white ring-1 ring-white/40 backdrop-blur-sm hover:text-navy" to="/destinations">{t('Explore destinations')}</Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-2.5" role="group" aria-label="Choose hero slide">
        {slides.map((item, index) => (
          <button
            aria-label={`Show ${item.location} slide`}
            aria-current={index === active ? 'true' : undefined}
            className={`h-2 rounded-full transition-all ${index === active ? 'w-9 bg-sun' : 'w-2 bg-white/55 hover:bg-white'}`}
            key={item.location}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  )
}
