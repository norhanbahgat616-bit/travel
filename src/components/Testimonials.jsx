import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const reviews = [
  { name: 'Nadia Hassan', trip: 'Dahab Slow Living', rating: 5, quote: 'Everything felt considered without ever feeling over-planned. Dahab gave us the slow days we needed.' },
  { name: 'Omar Khaled', trip: 'Red Sea Escape', rating: 5, quote: 'From the first message to our last airport transfer, the team made our family trip feel easy.' },
  { name: 'Mariam Adel', trip: 'Coastal Discovery', rating: 5, quote: 'The local recommendations made all the difference. We found places we would never have found ourselves.' },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % reviews.length), 6000)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion])
  const move = (direction) => setActive((current) => (current + direction + reviews.length) % reviews.length)
  const review = reviews[active]
  return <section className="mt-10" aria-label="Traveler testimonials" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => { setPaused(true); setTouchStart(event.changedTouches[0].clientX) }} onTouchEnd={(event) => { if (touchStart !== null && Math.abs(event.changedTouches[0].clientX - touchStart) > 45) move(event.changedTouches[0].clientX < touchStart ? 1 : -1); setTouchStart(null); setPaused(false) }} onKeyDown={(event) => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1) }} tabIndex={0}>
    <motion.article key={review.name} initial={reduceMotion ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="mx-auto max-w-3xl rounded-3xl border border-[#e7efef] bg-white p-7 text-center shadow-[0_16px_44px_#183b4e0b] sm:p-11">
      <div className="flex justify-center gap-1 text-sun" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={16} className="fill-current" />)}</div>
      <blockquote className="mt-5 text-lg font-medium leading-8 sm:text-xl">“{review.quote}”</blockquote>
      <div className="mt-7 flex items-center justify-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-mist text-sm font-bold text-turquoise">{review.name.split(' ').map((part) => part[0]).join('')}</span><span className="text-start"><strong className="block text-sm">{review.name}</strong><span className="text-xs text-muted">{review.trip}</span></span></div>
    </motion.article>
    <div className="mt-6 flex items-center justify-center gap-4"><button className="grid h-10 w-10 place-items-center rounded-full border border-[#e7efef]" onClick={() => move(-1)} aria-label="Previous testimonial"><ArrowLeft size={17} /></button><div className="flex gap-2">{reviews.map((item, index) => <button key={item.name} onClick={() => setActive(index)} aria-label={`Show testimonial ${index + 1}`} aria-current={index === active ? 'true' : undefined} className={`h-2 rounded-full ${index === active ? 'w-7 bg-turquoise' : 'w-2 bg-[#cad8d9]'}`} />)}</div><button className="grid h-10 w-10 place-items-center rounded-full border border-[#e7efef]" onClick={() => move(1)} aria-label="Next testimonial"><ArrowRight size={17} /></button></div>
  </section>
}
