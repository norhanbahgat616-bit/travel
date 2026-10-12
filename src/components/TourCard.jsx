import { Clock3, Star, ArrowUpRight, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Photo from './Photo'
import { useWishlist } from '../context/useWishlist'
import { useCurrency } from '../context/useCurrency'
import { useLanguage } from '../context/useLanguage'

export default function TourCard({ tour, index = 0, compare = false, onCompareChange, selected = false }) {
  const { isSaved, toggle } = useWishlist()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const saved = isSaved('tour', tour.slug)
  return (
    <motion.article
      className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_38px_#183b4e0d] transition-shadow hover:shadow-[0_20px_44px_#183b4e18]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.55 }}
      whileHover={{ y: -6 }}
    >
      <div className="relative h-56 overflow-hidden">
        <Photo src={tour.image} alt={`${tour.title} in ${tour.place}`} className="h-full w-full transition-transform duration-700 hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-navy">{tour.tag}</span>
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-xs font-semibold"><Star className="fill-sun text-sun" size={13} />{tour.rating.toFixed(1)}</span>
        <button type="button" className="absolute right-4 top-14 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-coral shadow" aria-label={saved ? 'Remove trip from wishlist' : 'Add trip to wishlist'} aria-pressed={saved} onClick={() => toggle({ type: 'tour', slug: tour.slug, title: tour.title, place: tour.place, image: tour.image, path: `/trips/${tour.slug}` })}><Heart size={18} className={saved ? 'fill-coral text-coral' : ''} /></button>
      </div>
      <div className="p-6">
        <p className="text-xs font-medium text-turquoise">{t(tour.place)}, {t('Egypt')}</p>
        <Link to={`/trips/${tour.slug}`} className="mt-2 block text-xl font-semibold hover:text-turquoise">{t(tour.title)}</Link>
        <div className="mt-4 flex items-center justify-between border-t border-[#edf1f1] pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted"><Clock3 size={15} />{tour.days} days</span>
          <span className="text-right"><span className="text-xs text-muted">from </span><strong className="text-base">{formatPrice(tour.price)}</strong><span className="block text-[10px] text-muted">per person</span></span>
        </div>
        {compare && <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-muted"><input type="checkbox" checked={selected} onChange={(event) => onCompareChange(tour, event.target.checked)} />Compare this trip</label>}
        <div className="mt-5 grid gap-2"><Link className="button-outline min-h-10 w-full text-sm" to={`/trips/${tour.slug}`}>{t('Trip details')} <ArrowUpRight size={16} /></Link><Link className="button-primary min-h-10 w-full text-sm" to={`/trips/${tour.slug}/book`}>{t('Book Now')} <ArrowUpRight size={16} /></Link></div>
      </div>
    </motion.article>
  )
}
