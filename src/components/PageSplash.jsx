import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plane } from 'lucide-react'

const KEY = 'tgt-splash-shown'
export default function PageSplash() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(KEY))
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (!visible) return undefined
    localStorage.setItem(KEY, 'yes')
    const timer = window.setTimeout(() => setVisible(false), 850)
    return () => window.clearTimeout(timer)
  }, [visible])
  return <AnimatePresence>{visible && <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-navy text-white" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .25 }}><div className="text-center"><motion.span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-turquoise" animate={reduceMotion ? {} : { x: [0, 8, 0], y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity }}><Plane size={30} /></motion.span><p className="mt-5 text-sm font-semibold tracking-[.16em]">TRAVEL GOLF TOURS</p><p className="mt-2 text-xs text-white/65">Your Egypt escape starts here</p></div></motion.div>}</AnimatePresence>
}
