import { Compass, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { patterns, readStoredList } from '../utils/validators'
import { useLanguage } from '../context/useLanguage'
import { showAlert } from '../utils/alert'

const quickLinks = [
  ['Destinations', '/destinations'], ['Services', '/services'], ['Visa support', '/visas'],
  ['Trips', '/trips'], ['Trip calculator', '/calculator'], ['Gallery', '/gallery'], ['Contact', '/contact'],
]

export default function Footer() {
  const { t } = useLanguage()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const subscribe = async ({ email }) => {
    const emails = readStoredList('newsletter')
    if (emails.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      await showAlert({ icon: 'info', title: 'Already subscribed', text: 'This email is already on our list.', confirmButtonColor: '#19A7A0' })
      return
    }
    localStorage.setItem('newsletter', JSON.stringify([{ email: email.toLowerCase(), createdAt: new Date().toISOString() }, ...emails]))
    reset()
    await showAlert({ icon: 'success', title: 'You’re on the list', text: 'Look out for thoughtful Egypt travel inspiration.', confirmButtonColor: '#19A7A0' })
  }
  return (
    <footer className="bg-[#102d3d] text-white">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-[1.4fr_.8fr_1fr] md:py-20">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Travel Golf Tours home">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-turquoise"><Compass size={23} /></span>
            <span className="leading-tight"><span className="block text-sm font-bold tracking-[.08em]">TRAVEL GOLF</span><span className="block text-[10px] tracking-[.25em] text-white/65">TOURS · EGYPT</span></span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">The Egypt you came to find, with a local team who knows where to look. Your next story starts here.</p>
          <form className="mt-6 max-w-sm" onSubmit={handleSubmit(subscribe)} noValidate>
            <label htmlFor="newsletter-email" className="mb-2 block text-xs font-semibold">A little inspiration, occasionally</label>
            <div className="flex gap-2"><input id="newsletter-email" type="email" placeholder="Email address" className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-xs text-white placeholder:text-white/50" aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Email is required.', pattern: { value: patterns.email, message: 'Enter a valid email.' } })} /><button className="rounded-full bg-turquoise px-4 text-xs font-semibold" disabled={isSubmitting}>Join</button></div>
            {errors.email && <p className="mt-2 text-xs text-coral">{errors.email.message}</p>}
          </form>
        </div>
        <div>
          <h2 className="mb-5 text-sm font-semibold">{t('Explore')}</h2>
          <ul className="space-y-3 text-sm text-white/65">
            {[...quickLinks, ['Wishlist', '/wishlist'], ['Track a request', '/track'], ['FAQ', '/faq']].map(([label, href]) => <li key={href}><Link className="hover:text-white" to={href}>{t(label)}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-5 text-sm font-semibold">{t('Company & contact')}</h2>
          <ul className="space-y-4 text-sm text-white/70">
            <li><Link className="hover:text-white" to="/about">{t('About Travel Golf Tours')}</Link></li>
            <li className="flex items-center gap-3"><Phone size={16} className="shrink-0 text-turquoise" /><a href="tel:01015541120">010 155 411 20</a></li>
            <li className="flex items-center gap-3"><Mail size={16} className="shrink-0 text-turquoise" /><a href="mailto:info@travelgolftours.com">info@travelgolftours.com</a></li>
            <li className="flex items-center gap-3"><MapPin size={16} className="shrink-0 text-turquoise" />{t('Egypt')} · {t('Daily Support')}</li>
          </ul>
          <Link className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sun hover:text-white" to="/contact">Get in touch <ArrowUpRight size={15} /></Link>
          <div className="mt-5 flex gap-4 text-xs text-white/60"><Link to="/privacy" className="hover:text-white">Privacy</Link><Link to="/terms" className="hover:text-white">Terms</Link></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Travel Golf Tours. Made for your next great story.</p><p>Thoughtfully local. Always Egypt.</p>
        </div>
      </div>
    </footer>
  )
}
