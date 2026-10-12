import { ArrowUpRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/useWishlist'
import { useLanguage } from '../context/useLanguage'
import Photo from './Photo'

export default function DestinationCard({ destination, index = 0 }) {
  const { isSaved, toggle } = useWishlist()
  const { t } = useLanguage()
  const saved = isSaved('destination', destination.slug)
  return (
    <motion.div
      className="group relative isolate block h-[340px] overflow-hidden rounded-3xl bg-navy shadow-[0_14px_38px_#183b4e18]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.55 }}
      whileHover={{ y: -7 }}
    >
      <Photo src={destination.image} alt={`${destination.name}, Egypt`} className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
      <span className="absolute left-5 top-5 z-20 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">{destination.tours} experiences</span>
      <button type="button" className="absolute right-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-coral shadow" aria-label={saved ? 'Remove destination from wishlist' : 'Add destination to wishlist'} aria-pressed={saved} onClick={() => toggle({ type: 'destination', slug: destination.slug, title: destination.name, place: destination.region, image: destination.image, path: `/trips?destination=${encodeURIComponent(destination.name)}` })}><Heart size={18} className={saved ? 'fill-coral text-coral' : ''} /></button>
      <span className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between gap-3 text-white">
        <span>
          <span className="mb-2 flex items-center gap-1 text-xs text-white/75"><MapPin size={13} />{t(destination.region)}</span>
          <span className="block text-xl font-semibold">{t(destination.name)}</span>
          <span className="mt-1 block text-xs text-white/75">{t(destination.detail)}</span>
        </span>
        <Link to={`/trips?destination=${encodeURIComponent(destination.name)}`} aria-label={`Browse trips to ${destination.name}`} className="absolute inset-0 z-30" />
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-navy transition-colors group-hover:bg-sun"><ArrowUpRight size={18} /></span>
      </span>
    </motion.div>
  )
}
