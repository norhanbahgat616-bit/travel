import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDestinations, useServices, useTours, useVisas } from '../hooks/useData'

export default function SearchPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const destinationQuery = useDestinations()
  const serviceQuery = useServices()
  const visaQuery = useVisas()
  const tourQuery = useTours()
  const results = (() => {
    const destinations = destinationQuery.data || []
    const services = serviceQuery.data || []
    const visas = visaQuery.data || []
    const tours = tourQuery.data || []
    const all = [
      ...destinations.map((item) => ({ title: item.name, subtitle: 'Destination', path: `/trips?destination=${encodeURIComponent(item.name)}` })),
      ...services.map((item) => ({ title: item.title, subtitle: 'Service', path: `/services/${item.slug}` })),
      ...visas.map((item) => ({ title: item.title, subtitle: 'Visa guide', path: `/visas/${item.slug}` })),
      ...tours.map((item) => ({ title: item.title, subtitle: `${item.place} · ${item.days} days`, path: `/trips/${item.slug}` })),
    ]
    const cleaned = query.trim().toLowerCase()
    return (cleaned ? all.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(cleaned)) : all).slice(0, 8)
  })()
  useEffect(() => {
    if (!open) return undefined
    const timer = window.setTimeout(() => {
      setQuery('')
      setActive(0)
      inputRef.current?.focus()
    }, 40)
    return () => window.clearTimeout(timer)
  }, [open])
  const choose = (item) => {
    onClose()
    navigate(item.path)
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose() }
    if (results.length === 0) return
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.min(index + 1, results.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)) }
    if (event.key === 'Enter' && results[active]) { event.preventDefault(); choose(results[active]) }
    if (event.key === 'Tab') {
      const focusables = [...event.currentTarget.querySelectorAll('input, button:not(:disabled)')]
      const first = focusables[0]
      const last = focusables.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#071821]/70 p-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} role="dialog" aria-modal="true" aria-label="Search travel options" onKeyDown={handleKeyDown}>
    <motion.div initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
      <label className="flex items-center gap-3 border-b border-[#e7efef] px-5"><span aria-hidden="true">⌕</span><input ref={inputRef} className="min-h-16 flex-1 bg-transparent text-base outline-none" value={query} onChange={(event) => { setQuery(event.target.value); setActive(0) }} placeholder="Search destinations, tours, visas…" aria-label="Search destinations, tours, visas and services" /><kbd className="rounded bg-mist px-2 py-1 text-xs text-muted">ESC</kbd></label>
      <ul className="max-h-[55vh] overflow-auto p-2">{results.map((item, index) => <li key={`${item.subtitle}-${item.path}`}><button className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-start ${index === active ? 'bg-mist' : 'hover:bg-mist'}`} onMouseEnter={() => setActive(index)} onClick={() => choose(item)}><span className="font-medium">{highlight(item.title, query)}</span><span className="text-xs text-muted">{item.subtitle}</span></button></li>)}{results.length === 0 && <li className="p-6 text-center text-sm text-muted">No matching travel options. Try another search.</li>}</ul>
      <p className="border-t border-[#e7efef] px-5 py-3 text-xs text-muted">Use ↑ ↓ to navigate · Enter to open</p>
    </motion.div>
  </motion.div>}</AnimatePresence>
}

function highlight(text, search) {
  if (!search.trim()) return text
  const index = text.toLowerCase().indexOf(search.trim().toLowerCase())
  if (index < 0) return text
  return <>{text.slice(0, index)}<mark className="rounded bg-sun/50">{text.slice(index, index + search.trim().length)}</mark>{text.slice(index + search.trim().length)}</>
}
