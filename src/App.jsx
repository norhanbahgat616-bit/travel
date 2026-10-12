import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import FloatingActions from './components/FloatingActions'
import CookieConsent from './components/CookieConsent'
import PageSplash from './components/PageSplash'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Destinations = lazy(() => import('./pages/Destinations'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'))
const Visas = lazy(() => import('./pages/Visas'))
const VisaDetails = lazy(() => import('./pages/VisaDetails'))
const Tours = lazy(() => import('./pages/Tours'))
const About = lazy(() => import('./pages/About'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Calculator = lazy(() => import('./pages/Calculator'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const TourDetails = lazy(() => import('./pages/TourDetails'))
const TripBooking = lazy(() => import('./pages/TripBooking'))
const TripConfirmation = lazy(() => import('./pages/TripConfirmation'))
const Track = lazy(() => import('./pages/Track'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])
  return null
}

function PageTransition({ children }) {
  const reduceMotion = useReducedMotion()
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: .24 }}>{children}</motion.div>
}

function SiteLayout({ children }) {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Navbar /><main id="main-content">{children}</main><Footer /><FloatingActions /><CookieConsent /><PageSplash /></>
}

function SitePage({ children }) {
  return <PageTransition><SiteLayout>{children}</SiteLayout></PageTransition>
}

function StandalonePage({ children }) {
  return <PageTransition>{children}</PageTransition>
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm font-medium text-muted">Preparing your Egypt escape…</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={`${location.pathname}${location.search}`}>
            <Route path="/" element={<SitePage><Home /></SitePage>} />
            <Route path="/destinations" element={<SitePage><Destinations /></SitePage>} />
            <Route path="/services" element={<SitePage><Services /></SitePage>} />
            <Route path="/services/:slug" element={<SitePage><ServiceDetails /></SitePage>} />
            <Route path="/visas" element={<SitePage><Visas /></SitePage>} />
            <Route path="/visas/:slug" element={<SitePage><VisaDetails /></SitePage>} />
            <Route path="/trips" element={<SitePage><Tours /></SitePage>} />
            <Route path="/trips/:slug/booked" element={<SitePage><TripConfirmation /></SitePage>} />
            <Route path="/trips/:slug/book" element={<SitePage><TripBooking /></SitePage>} />
            <Route path="/trips/:slug" element={<SitePage><TourDetails /></SitePage>} />
            <Route path="/tours" element={<Navigate to="/trips" replace />} />
            <Route path="/tours/:slug" element={<LegacyTourRedirect />} />
            <Route path="/calculator" element={<SitePage><Calculator /></SitePage>} />
            <Route path="/wishlist" element={<SitePage><Wishlist /></SitePage>} />
            <Route path="/track" element={<SitePage><Track /></SitePage>} />
            <Route path="/faq" element={<SitePage><FAQ /></SitePage>} />
            <Route path="/privacy" element={<SitePage><Privacy /></SitePage>} />
            <Route path="/terms" element={<SitePage><Terms /></SitePage>} />
            <Route path="/about" element={<SitePage><About /></SitePage>} />
            <Route path="/gallery" element={<SitePage><Gallery /></SitePage>} />
            <Route path="/contact" element={<SitePage><Contact /></SitePage>} />
            <Route path="/booking" element={<LegacyBookingRedirect />} />
            <Route path="/signin" element={<StandalonePage><SignIn /></StandalonePage>} />
            <Route path="/signup" element={<StandalonePage><SignUp /></StandalonePage>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<StandalonePage><Dashboard /></StandalonePage>} />
            </Route>
            <Route path="*" element={<SitePage><NotFound /></SitePage>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}

function LegacyTourRedirect() {
  const location = useLocation()
  return <Navigate to={`/trips${location.pathname.slice('/tours'.length)}${location.search}`} replace />
}

function LegacyBookingRedirect() {
  const location = useLocation()
  return <Navigate to={`/trips${location.search}`} replace />
}
