import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, CalendarDays, ChartNoAxesCombined, Check, Compass, FileText, LogOut, Search, Users, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useBookings, useVisaRequests } from '../hooks/useData'
import { readStoredList } from '../utils/validators'
import { QueryError } from '../components/Loader'
import { showAlert } from '../utils/alert'

const tabs = ['Bookings', 'Visa requests']
const cleanSearch = (text) => text.toLowerCase().trim()
const emptyRecords = []

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const queryClient = useQueryClient()
  const bookingsQuery = useBookings()
  const visasQuery = useVisaRequests()
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [search, setSearch] = useState('')
  const bookings = bookingsQuery.data || emptyRecords
  const visaRequests = visasQuery.data || emptyRecords
  const filteredBookings = useMemo(() => bookings.filter((item) => cleanSearch(`${item.id} ${item.name} ${item.destination} ${item.tripTitle || ''}`).includes(cleanSearch(search))), [bookings, search])
  const filteredVisas = useMemo(() => visaRequests.filter((item) => cleanSearch(`${item.id} ${item.name} ${item.visaTitle} ${item.visaType}`).includes(cleanSearch(search))), [visaRequests, search])
  const nextTrip = useMemo(() => bookings.map((booking) => ({ ...booking, dateObject: new Date(`${booking.date}T00:00:00`) })).filter((booking) => !Number.isNaN(booking.dateObject.getTime()) && booking.dateObject >= new Date(new Date().setHours(0, 0, 0, 0))).sort((a, b) => a.dateObject - b.dateObject)[0], [bookings])
  const daysUntilTrip = nextTrip ? Math.ceil((nextTrip.dateObject - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000) : null
  const destinationCounts = useMemo(() => bookings.reduce((counts, booking) => ({ ...counts, [booking.destination || 'Other']: (counts[booking.destination || 'Other'] || 0) + 1 }), {}), [bookings])
  const updateStatus = (record, kind, status) => {
    const key = kind === 'visa' ? 'visaRequests' : 'bookings'
    const updated = readStoredList(key).map((item) => item.id === record.id ? { ...item, status } : item)
    localStorage.setItem(key, JSON.stringify(updated))
    queryClient.setQueryData([key], updated)
  }

  const handleSignOut = async () => {
    const result = await showAlert({ title: 'Ready to sign out?', text: 'You’ll need to sign in again to access your dashboard.', icon: 'question', showCancelButton: true, confirmButtonText: 'Sign out', cancelButtonText: 'Cancel', confirmButtonColor: '#19A7A0', cancelButtonColor: '#6C7D85' })
    if (result.isConfirmed) {
      signOut()
      window.location.replace('/')
    }
  }

  const deleteRecord = async (record, kind) => {
    const isVisa = kind === 'visa'
    const result = await showAlert({ title: 'Delete this request?', text: `${record.id} will be removed from your dashboard.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Keep it', confirmButtonColor: '#FF8A65', cancelButtonColor: '#6C7D85' })
    if (!result.isConfirmed) return
    const key = isVisa ? 'visaRequests' : 'bookings'
    const queryKey = [key]
    if (!isVisa) {
      const removed = readStoredList('deletedTravelRecords')
      if (!removed.includes(record.id)) localStorage.setItem('deletedTravelRecords', JSON.stringify([...removed, record.id]))
    }
    const saved = readStoredList(key).filter((item) => item.id !== record.id)
    localStorage.setItem(key, JSON.stringify(saved))
    queryClient.setQueryData(queryKey, (current = []) => current.filter((item) => item.id !== record.id))
    await showAlert({ icon: 'success', title: 'Request deleted', confirmButtonColor: '#19A7A0', timer: 1400, showConfirmButton: false })
  }

  const stats = [
    { label: 'Total bookings', value: bookings.length, delta: 'Trips planned', Icon: CalendarDays, accent: 'bg-[#eaf8f6] text-turquoise' },
    { label: 'Visa requests', value: visaRequests.length, delta: 'Applications supported', Icon: FileText, accent: 'bg-[#fff5e5] text-[#d69219]' },
    { label: 'Travelers', value: bookings.reduce((total, booking) => total + Number(booking.travelers || 0), 0), delta: 'Across all bookings', Icon: Users, accent: 'bg-[#f0edff] text-[#8870d8]' },
    { label: 'Active destinations', value: 5, delta: 'Along the coast', Icon: Compass, accent: 'bg-[#fff0eb] text-coral' },
  ]
  const statusClass = { Confirmed: 'bg-[#e7f7f3] text-[#188c74]', Pending: 'bg-[#fff5df] text-[#b8801b]', 'In review': 'bg-[#eff3ff] text-[#5269b6]', Completed: 'bg-[#e7f7f3] text-[#188c74]', Cancelled: 'bg-[#fff0eb] text-[#d5684b]' }

  return (
    <>
      <Helmet><title>Dashboard | Travel Golf Tours</title><meta name="description" content="Manage your Travel Golf Tours bookings and visa requests." /></Helmet>
      <main className="min-h-screen bg-[#f5f8f8] text-navy">
        <header className="sticky top-0 z-30 border-b border-[#edf1f1] bg-white/95 backdrop-blur-xl">
          <div className="section-shell flex h-[76px] items-center justify-between">
            <Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-turquoise text-white"><Compass size={21} /></span><span className="leading-tight"><span className="block text-xs font-bold tracking-[.08em]">TRAVEL GOLF</span><span className="block text-[9px] tracking-[.22em] text-muted">TRAVEL DASHBOARD</span></span></Link>
            <div className="flex items-center gap-4"><span className="hidden text-sm text-muted sm:inline">Hello, <strong className="text-navy">{user?.name || 'traveler'}</strong></span><button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-[#e8efef] px-4 py-2 text-xs font-semibold text-muted transition hover:border-coral hover:text-coral"><LogOut size={15} />Sign out</button></div>
          </div>
        </header>
        <div className="section-shell py-8 sm:py-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
            <div className="mb-7"><p className="eyebrow">Your travel space</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Good day, {user?.name?.split(' ')[0] || 'traveler'}.</h1><p className="mt-2 text-sm text-muted">Here’s a look at your plans and requests.</p></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, delta, Icon, accent }, index) => <motion.article key={label} className="rounded-2xl border border-[#edf1f1] bg-white p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}><span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}><Icon size={19} /></span><p className="mt-5 text-[11px] font-medium text-muted">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-[10px] text-muted">{delta}</p></motion.article>)}</div>
          </motion.div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            <article className="rounded-2xl border border-[#edf1f1] bg-white p-5"><p className="text-xs font-semibold text-turquoise">NEXT UPCOMING TRIP</p>{nextTrip ? <><p className="mt-3 text-3xl font-bold">{daysUntilTrip} <span className="text-sm font-medium text-muted">days</span></p><p className="mt-1 text-sm text-muted">{nextTrip.destination} · {nextTrip.date}</p></> : <p className="mt-3 text-sm text-muted">No upcoming trip dates yet.</p>}</article>
            <article className="rounded-2xl border border-[#edf1f1] bg-white p-5"><p className="text-xs font-semibold text-turquoise">BOOKINGS BY DESTINATION</p><div className="mt-4 flex h-24 items-end gap-3" role="img" aria-label="Bar chart showing bookings by destination">{Object.entries(destinationCounts).length ? Object.entries(destinationCounts).map(([destination, count]) => <div key={destination} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center"><span className="mb-1 text-[10px]">{count}</span><div className="mx-auto w-full max-w-12 rounded-t-lg bg-turquoise" style={{ height: `${Math.max(12, (count / Math.max(...Object.values(destinationCounts))) * 72)}px` }} /><span className="mt-1 truncate text-[9px] text-muted">{destination}</span></div>) : <p className="self-center text-xs text-muted">No bookings to chart yet.</p>}</div></article>
          </div>

          <section className="mt-7 overflow-hidden rounded-2xl border border-[#edf1f1] bg-white">
            <div className="flex flex-col gap-4 border-b border-[#f0f3f3] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div><h2 className="text-lg font-semibold">Your requests</h2><p className="mt-1 text-xs text-muted">Review your travel plans and visa guidance requests.</p></div>
              <label className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aabad]" size={15} /><input className="field-input min-h-10 pl-9 text-xs" placeholder="Search your requests…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search dashboard requests" /></label>
            </div>
            <div className="flex gap-5 border-b border-[#f0f3f3] px-5 sm:px-6" role="tablist" aria-label="Request type">
              {tabs.map((tab) => <button id={`tab-${tab}`} aria-selected={activeTab === tab} role="tab" key={tab} className={`border-b-2 px-1 py-4 text-sm font-semibold transition ${activeTab === tab ? 'border-turquoise text-turquoise' : 'border-transparent text-muted hover:text-navy'}`} onClick={() => setActiveTab(tab)}>{tab}<span className="ml-2 rounded-full bg-[#f2f6f6] px-2 py-0.5 text-[10px]">{tab === 'Bookings' ? bookings.length : visaRequests.length}</span></button>)}
            </div>
            <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
              {activeTab === 'Bookings' && bookingsQuery.isPending && <div className="space-y-3 p-6">{Array.from({ length: 3 }, (_, index) => <div key={index} className="skeleton h-12 w-full" />)}</div>}
              {activeTab === 'Bookings' && bookingsQuery.isError && <div className="p-6"><QueryError onRetry={() => bookingsQuery.refetch()} /></div>}
              {activeTab === 'Visa requests' && visasQuery.isPending && <div className="space-y-3 p-6">{Array.from({ length: 2 }, (_, index) => <div key={index} className="skeleton h-12 w-full" />)}</div>}
              {activeTab === 'Visa requests' && visasQuery.isError && <div className="p-6"><QueryError onRetry={() => visasQuery.refetch()} /></div>}
              {activeTab === 'Bookings' && bookingsQuery.data && (filteredBookings.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead><tr className="bg-[#fafcfc] text-[10px] font-semibold uppercase tracking-wider text-[#9aabad]"><th className="px-5 py-3.5 sm:px-6">Booking</th><th className="px-4 py-3.5">Trip / destination</th><th className="px-4 py-3.5">Travel date</th><th className="px-4 py-3.5">Travelers</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Action</th></tr></thead><tbody>{filteredBookings.map((booking) => <tr key={booking.id} className="border-t border-[#f0f3f3] hover:bg-[#fbfdfd]"><td className="px-5 py-4 sm:px-6"><p className="font-semibold">{booking.name}</p><p className="mt-1 text-[10px] text-muted">{booking.id}</p></td><td className="px-4 py-4"><span>{booking.tripTitle || booking.destination}</span>{booking.tripTitle && <span className="mt-1 block text-[10px] text-muted">{booking.destination}</span>}</td><td className="whitespace-nowrap px-4 py-4 text-muted">{booking.date || 'To be confirmed'}</td><td className="px-4 py-4">{booking.travelers}</td><td className="px-4 py-4"><select aria-label={`Update status for booking ${booking.id}`} className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusClass[booking.status] || statusClass.Pending}`} value={booking.status || 'Pending'} onChange={(event) => updateStatus(booking, 'booking', event.target.value)}>{['Pending','In review','Confirmed','Completed','Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-4 py-4"><button className="rounded-lg p-2 text-muted transition hover:bg-[#fff0eb] hover:text-coral" aria-label={`Delete booking ${booking.id}`} onClick={() => deleteRecord(booking, 'booking')}><X size={15} /></button></td></tr>)}</tbody></table></div> : <EmptyState text={search ? 'No bookings match your search.' : 'You haven’t requested a trip yet.'} link="/trips" cta="Browse trips" />)}
              {activeTab === 'Visa requests' && visasQuery.data && (filteredVisas.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead><tr className="bg-[#fafcfc] text-[10px] font-semibold uppercase tracking-wider text-[#9aabad]"><th className="px-5 py-3.5 sm:px-6">Applicant</th><th className="px-4 py-3.5">Visa</th><th className="px-4 py-3.5">Travel date</th><th className="px-4 py-3.5">Applicants</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Action</th></tr></thead><tbody>{filteredVisas.map((request) => <tr key={request.id} className="border-t border-[#f0f3f3] hover:bg-[#fbfdfd]"><td className="px-5 py-4 sm:px-6"><p className="font-semibold">{request.name}</p><p className="mt-1 text-[10px] text-muted">{request.id}</p></td><td className="px-4 py-4">{request.visaTitle || request.visaType}</td><td className="whitespace-nowrap px-4 py-4 text-muted">{request.travelDate}</td><td className="px-4 py-4">{request.applicants}</td><td className="px-4 py-4"><select aria-label={`Update status for visa request ${request.id}`} className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusClass[request.status] || statusClass.Pending}`} value={request.status || 'Pending'} onChange={(event) => updateStatus(request, 'visa', event.target.value)}>{['Pending','In review','Confirmed','Completed','Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-4 py-4"><button className="rounded-lg p-2 text-muted transition hover:bg-[#fff0eb] hover:text-coral" aria-label={`Delete visa request ${request.id}`} onClick={() => deleteRecord(request, 'visa')}><X size={15} /></button></td></tr>)}</tbody></table></div> : <EmptyState text={search ? 'No visa requests match your search.' : 'You don’t have a visa request yet.'} link="/visas" cta="Explore visa support" />)}
            </div>
            <div className="flex items-center justify-between border-t border-[#f0f3f3] px-5 py-4 sm:px-6"><span className="text-[10px] text-muted">All amounts and visa timelines are subject to confirmation.</span><Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-turquoise">Travel home <ArrowUpRight size={13} /></Link></div>
          </section>
          <footer className="mt-8 flex items-center justify-between text-[10px] text-muted"><span>© {new Date().getFullYear()} Travel Golf Tours</span><span className="inline-flex items-center gap-1"><ChartNoAxesCombined className="text-turquoise" size={14} /> Egypt, made personal.</span></footer>
        </div>
      </main>
    </>
  )
}

function EmptyState({ text, link, cta }) {
  return <div className="px-6 py-14 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mist text-turquoise"><Check size={20} /></span><p className="mt-4 text-sm text-muted">{text}</p><Link to={link} className="button-primary mt-5 min-h-10 text-xs">{cta}</Link></div>
}
