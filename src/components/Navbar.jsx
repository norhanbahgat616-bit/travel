import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Calculator, ChevronDown, Compass, Heart, Map, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useLanguage } from '../context/useLanguage'
import { useTheme } from '../context/useTheme'
import { useWishlist } from '../context/useWishlist'
import { useCurrency } from '../context/useCurrency'
import SearchPalette from './SearchPalette'
import { showAlert } from '../utils/alert'

const mainLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Contact', '/contact'],
]
const destinationItems = [
  { title: 'Trips', description: 'Browse all trips and packages', to: '/trips', Icon: Map },
  { title: 'Trip Calculator', description: 'Estimate the cost of your trip', to: '/calculator', Icon: Calculator },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [destinationsOpen, setDestinationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { count } = useWishlist()
  const { currency, chooseCurrency } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const mobileTriggerRef = useRef(null)
  const itemRefs = useRef([])
  const closeTimer = useRef(null)
  const keyboardInput = useRef(false)
  const tripsActive = /^\/(destinations|trips)(\/|$)/.test(location.pathname) || location.pathname === '/calculator'
  const useWhite = location.pathname !== '/' || scrolled
  const textClass = useWhite ? 'text-navy' : 'text-white'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setScrolled(window.scrollY > 28))
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) keyboardInput.current = true
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape' && destinationsOpen) {
        event.preventDefault()
        setDestinationsOpen(false)
        keyboardInput.current = false
        ;(window.innerWidth < 1280 ? mobileTriggerRef.current : triggerRef.current)?.focus()
      }
    }
    const onPointerDown = (event) => {
      keyboardInput.current = false
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDestinationsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.clearTimeout(closeTimer.current)
    }
  }, [destinationsOpen])

  const openDropdown = () => {
    window.clearTimeout(closeTimer.current)
    setDestinationsOpen(true)
  }
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setDestinationsOpen(false), 180)
  }
  const handleMenuKeys = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const current = itemRefs.current.indexOf(document.activeElement)
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? destinationItems.length - 1
        : event.key === 'ArrowDown' ? (current + 1 + destinationItems.length) % destinationItems.length
          : (current - 1 + destinationItems.length) % destinationItems.length
    itemRefs.current[next]?.focus()
  }
  const closeMenu = () => {
    setMenuOpen(false)
    setDestinationsOpen(false)
  }
  const handleSignOut = async () => {
    const result = await showAlert({
      title: 'Sign out of your account?',
      text: 'You can sign back in whenever you like.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sign out',
      cancelButtonText: 'Stay here',
      confirmButtonColor: '#19A7A0',
      cancelButtonColor: '#6C7D85',
      background: theme === 'dark' ? '#183B4E' : '#fff',
      color: theme === 'dark' ? '#f4f8f9' : '#183B4E',
    })
    if (result.isConfirmed) {
      signOut()
      navigate('/')
    }
  }
  const linkClass = ({ isActive }) => `whitespace-nowrap transition-colors hover:text-turquoise ${isActive ? 'border-b-2 border-turquoise pb-1 text-turquoise' : ''}`
  const utilityClass = `grid h-9 w-9 place-items-center rounded-full ${textClass}`

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${useWhite ? 'bg-white shadow-[0_8px_28px_#183b4e12]' : 'bg-transparent'}`}>
        <nav className="section-shell flex h-[78px] items-center justify-between gap-4" aria-label="Main navigation">
          <Link to="/" onClick={closeMenu} className={`flex shrink-0 items-center gap-2.5 ${textClass}`} aria-label="Travel Golf Tours home">
            <span className={`grid h-10 w-10 place-items-center rounded-2xl ${useWhite ? 'bg-turquoise text-white' : 'bg-white/15 text-white backdrop-blur'}`}><Compass size={22} /></span>
            <span className="leading-tight"><span className="block text-[13px] font-bold tracking-[.09em]">TRAVEL GOLF</span><span className="block text-[10px] font-medium tracking-[.27em] opacity-80">TOURS · EGYPT</span></span>
          </Link>

          <div className={`hidden items-center gap-5 text-[12px] font-medium xl:flex ${textClass}`}>
            {mainLinks.slice(0, 3).map(([label, href]) => <NavLink key={href} to={href} className={linkClass}>{t(label)}</NavLink>)}
            <div className="relative" ref={dropdownRef} onMouseEnter={openDropdown} onMouseLeave={scheduleClose} onFocusCapture={() => { if (keyboardInput.current) openDropdown() }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose() }}>
              <div className="flex items-center gap-1">
                <NavLink to="/destinations" className={() => `whitespace-nowrap transition-colors hover:text-turquoise ${tripsActive ? 'border-b-2 border-turquoise pb-1 text-turquoise' : ''}`}>{t('Destinations')}</NavLink>
                <button
                  ref={triggerRef}
                  type="button"
                  className={`grid h-8 w-8 place-items-center rounded-full transition hover:bg-mist ${tripsActive ? 'text-turquoise' : ''}`}
                  aria-label="Toggle destinations menu"
                  aria-haspopup="menu"
                  aria-expanded={destinationsOpen}
                  aria-controls="destinations-menu"
                  onClick={() => setDestinationsOpen((open) => !open)}
                  onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); openDropdown(); window.setTimeout(() => itemRefs.current[0]?.focus(), 0) } }}
                ><ChevronDown size={15} className={`transition-transform ${destinationsOpen ? 'rotate-180' : ''}`} /></button>
              </div>
              <AnimatePresence>
                {destinationsOpen && <motion.div id="destinations-menu" role="menu" aria-label="Destinations" onKeyDown={handleMenuKeys} onMouseEnter={openDropdown} onMouseLeave={scheduleClose} className="absolute end-0 top-full z-50 mt-3 w-[290px] rounded-2xl border border-[#e7efef] bg-white p-2 text-navy shadow-[0_18px_55px_#183b4e22]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: .16 }}>
                  {destinationItems.map(({ title, description, to, Icon }, index) => <Link key={to} ref={(node) => { itemRefs.current[index] = node }} role="menuitem" to={to} onClick={() => setDestinationsOpen(false)} className={`flex items-start gap-3 rounded-xl p-3 transition hover:bg-mist focus-visible:bg-mist ${location.pathname === to || (to === '/trips' && location.pathname.startsWith('/trips')) ? 'bg-mist text-turquoise' : ''}`}><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mist text-turquoise"><Icon size={18} /></span><span><strong className="block text-sm">{t(title)}</strong><span className="mt-1 block text-[11px] leading-5 text-muted">{t(description)}</span></span></Link>)}
                </motion.div>}
              </AnimatePresence>
            </div>
            <NavLink to={mainLinks[3][1]} className={linkClass}>{t(mainLinks[3][0])}</NavLink>
          </div>

          <div className="hidden shrink-0 items-center gap-1 xl:flex">
            {user ? <><span className={`mr-1 max-w-20 truncate text-xs font-medium ${textClass}`}>Hi, {user.name.split(' ')[0]}</span><Link className="rounded-full bg-mist px-3 py-2 text-xs font-semibold text-navy" to="/dashboard">{t('Dashboard')}</Link><button className={`px-2 py-2 text-xs font-medium ${textClass}`} onClick={handleSignOut}>{t('Sign out')}</button></> : <><Link className={`px-2 py-2 text-xs font-medium ${textClass}`} to="/signin">{t('Sign in')}</Link><Link className="rounded-full bg-turquoise px-3 py-2 text-xs font-semibold text-white" to="/signup">{t('Sign up')}</Link></>}
            <Link to="/wishlist" className={`relative ${utilityClass}`} aria-label={`Wishlist, ${count} saved items`}><Heart size={16} /><span className="absolute -end-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] text-white">{count}</span></Link>
            <button className={utilityClass} aria-label="Open search" title="Search (Ctrl+K)" onClick={() => setSearchOpen(true)}><Search size={16} /></button>
            <button className={`rounded-full px-2 py-1 text-[11px] font-bold ${textClass}`} onClick={toggleLanguage} aria-label="Switch language">{language === 'en' ? 'AR' : 'EN'}</button>
            <button className={utilityClass} onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
            <select className={`max-w-[66px] rounded-full border border-current/20 bg-transparent px-2 py-2 text-[10px] font-semibold ${textClass}`} aria-label="Currency" value={currency} onChange={(event) => chooseCurrency(event.target.value)}>{['EGP', 'USD', 'EUR', 'SAR'].map((item) => <option className="text-navy" key={item}>{item}</option>)}</select>
          </div>

          <button className={`grid h-10 w-10 shrink-0 place-items-center rounded-full xl:hidden ${textClass}`} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        <AnimatePresence>
          {menuOpen && <motion.div className="absolute inset-x-0 top-full max-h-[calc(100svh-78px)] overflow-y-auto border-t border-[#edf1f1] bg-white px-6 pb-6 pt-4 shadow-xl xl:hidden" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }}>
            <div className="mx-auto flex max-w-[1180px] flex-col">
              {mainLinks.slice(0, 3).map(([label, href]) => <NavLink className={({ isActive }) => `border-b border-[#edf1f1] py-3.5 text-sm font-medium ${isActive ? 'text-turquoise' : 'text-navy'}`} to={href} key={href} onClick={closeMenu}>{t(label)}</NavLink>)}
              <div className="border-b border-[#edf1f1]">
                <div className="flex items-center justify-between py-3.5">
                  <NavLink to="/destinations" className={() => `text-sm font-medium ${tripsActive ? 'text-turquoise' : 'text-navy'}`} onClick={closeMenu}>{t('Destinations')}</NavLink>
                  <button ref={mobileTriggerRef} type="button" className="grid h-9 w-9 place-items-center rounded-full text-navy" aria-label="Expand destinations menu" aria-haspopup="menu" aria-expanded={destinationsOpen} onClick={() => setDestinationsOpen((open) => !open)}><ChevronDown size={17} className={`transition-transform ${destinationsOpen ? 'rotate-180' : ''}`} /></button>
                </div>
                <AnimatePresence>{destinationsOpen && <motion.div className="overflow-hidden pb-2 ps-3" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .18 }}>{destinationItems.map(({ title, description, to, Icon }) => <Link key={to} to={to} onClick={closeMenu} className={`flex items-center gap-3 rounded-xl p-3 ${location.pathname === to ? 'bg-mist text-turquoise' : 'text-navy'}`}><Icon size={17} /><span><strong className="block text-sm">{t(title)}</strong><span className="text-[11px] text-muted">{t(description)}</span></span></Link>)}</motion.div>}</AnimatePresence>
              </div>
              <NavLink className={({ isActive }) => `py-3.5 text-sm font-medium ${isActive ? 'text-turquoise' : 'text-navy'}`} to={mainLinks[3][1]} onClick={closeMenu}>{t(mainLinks[3][0])}</NavLink>
              <div className="mt-5 flex gap-3">
                {user ? <><Link className="button-outline min-h-11 flex-1" to="/dashboard" onClick={closeMenu}>{t('Dashboard')}</Link><button className="button-primary min-h-11 flex-1" onClick={handleSignOut}>{t('Sign out')}</button></> : <><Link className="button-outline min-h-11 flex-1" to="/signin" onClick={closeMenu}>{t('Sign in')}</Link><Link className="button-primary min-h-11 flex-1" to="/signup" onClick={closeMenu}>{t('Sign up')}</Link></>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link to="/wishlist" onClick={closeMenu} className="inline-flex items-center gap-2 rounded-xl bg-mist px-4 py-3 text-sm font-semibold text-navy"><Heart size={16} />{t('Wishlist')} <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] text-white">{count}</span></Link>
                <div className="flex gap-2"><button className="button-outline min-h-9 px-3 text-xs" onClick={toggleLanguage}>{language === 'en' ? 'العربية' : 'English'}</button><button className="button-outline min-h-9 px-3" onClick={toggleTheme} aria-label="Toggle dark mode">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button><button className="button-outline min-h-9 px-3" onClick={() => { setMenuOpen(false); setSearchOpen(true) }} aria-label="Search"><Search size={15} /></button></div>
              </div>
              <div className="mt-3 flex justify-end"><select className="field-input min-h-9 w-20 py-1 text-xs" aria-label="Currency" value={currency} onChange={(event) => chooseCurrency(event.target.value)}>{['EGP', 'USD', 'EUR', 'SAR'].map((item) => <option key={item}>{item}</option>)}</select></div>
            </div>
          </motion.div>}
        </AnimatePresence>
      </header>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
