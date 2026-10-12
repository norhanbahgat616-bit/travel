import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className="divide-y divide-[#e9efef] rounded-2xl border border-[#e9efef] bg-white">
      {items.map((item, index) => (
        <div key={item.q} className="px-5">
          <button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold" aria-expanded={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? -1 : index)}>
            {item.q}<ChevronDown className={`shrink-0 text-turquoise transition-transform ${openIndex === index ? 'rotate-180' : ''}`} size={17} />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="pb-5 text-sm leading-7 text-muted">{item.a}</p></motion.div>}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
