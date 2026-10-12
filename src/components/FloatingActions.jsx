import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FloatingActions() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const excluded = ['/dashboard', '/signin', '/signup'].includes(pathname)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 480)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  if (excluded) return null
  const shareText = encodeURIComponent(`Hello Travel Golf Tours, I'm interested in planning a trip. Page: ${window.location.href}`)
  return <>
    <div className="floating-tools fixed bottom-5 end-5 z-40 hidden flex-col gap-3 sm:flex">
      {scrolled && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy shadow-lg" aria-label="Back to top"><ArrowUp size={18} /></button>}
      <a className="whatsapp-pulse grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl" href={`https://wa.me/201015541120?text=${shareText}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"><MessageCircle size={24} /></a>
    </div>
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-[#e7efef] bg-white/95 p-2 shadow-[0_-8px_30px_#183b4e15] backdrop-blur sm:hidden">
      <a href="tel:01015541120" className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-navy"><Phone size={17} className="text-turquoise" />{t('Call')}</a>
      <a href={`https://wa.me/201015541120?text=${shareText}`} target="_blank" rel="noreferrer" className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-navy"><MessageCircle size={17} className="text-[#25D366]" />{t('WhatsApp')}</a>
      <Link to="/trips" className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-navy"><span className="grid h-6 w-6 place-items-center rounded-full bg-turquoise text-white">+</span>{t('Book Now')}</Link>
    </div>
    {scrolled && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="floating-tools fixed bottom-24 end-4 z-40 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lg sm:hidden" aria-label="Back to top"><ArrowUp size={18} /></button>}
  </>
}
