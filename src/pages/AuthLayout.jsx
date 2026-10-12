import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { motion } from 'framer-motion'
import Photo from '../components/Photo'
import { getImage } from '../utils/images'

export default function AuthLayout({ mode, children }) {
  const signUp = mode === 'signup'
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="relative hidden min-h-screen overflow-hidden bg-navy lg:block">
        <Photo src={getImage(signUp ? 'about' : 'hero')} alt="The coast and mountains of Egypt" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102d3d]/90 via-[#102d3d]/25 to-[#102d3d]/35" />
        <Link to="/" className="absolute left-10 top-9 z-10 flex items-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur"><Compass size={23} /></span>
          <span className="leading-tight"><span className="block text-sm font-bold tracking-[.09em]">TRAVEL GOLF</span><span className="block text-[10px] tracking-[.25em] text-white/65">TOURS · EGYPT</span></span>
        </Link>
        <div className="absolute bottom-12 left-10 right-10 z-10 max-w-lg text-white">
          <span className="eyebrow text-sun">The good kind of getting lost</span>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-[-.05em]">{signUp ? 'Your Egypt story starts here.' : 'Welcome back to your next adventure.'}</h1>
          <p className="mt-5 text-sm leading-7 text-white/75">A local team, thoughtful details, and a little more room for wonder. We’ll take it from here.</p>
          <div className="mt-9 flex items-center gap-3"><span className="h-1.5 w-8 rounded-full bg-sun" /><span className="h-1.5 w-3 rounded-full bg-white/50" /><span className="text-xs text-white/75">Egypt is closer than you think</span></div>
        </div>
      </div>
      <main className="relative flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-navy lg:hidden"><ArrowLeft size={16} /> Back home</Link>
        <motion.div className="w-full max-w-[430px]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <div className="mb-8 lg:hidden"><Link to="/" className="inline-flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-turquoise text-white"><Compass size={19} /></span>TRAVEL GOLF TOURS</Link></div>
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export function AuthField({ label, error, ...props }) {
  return (
    <div className="form-field">
      <label className="field-label" htmlFor={props.id}>{label}</label>
      <input className="field-input" aria-invalid={Boolean(error)} {...props} />
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}
