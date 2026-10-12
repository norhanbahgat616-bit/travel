import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'

export default function ServiceCard({ service, index = 0 }) {
  const { Icon } = service
  const { t } = useLanguage()
  return (
    <motion.div
      className="rounded-3xl border border-[#e6f0ef] bg-white p-7 transition-shadow hover:shadow-[0_18px_38px_#183b4e12]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/services/${service.slug}`} className="block h-full" aria-label={`Read about ${service.title}`}>
      <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-mist text-turquoise"><Icon size={22} strokeWidth={1.8} /></span>
      <h3 className="text-base font-semibold">{t(service.title)}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{t(service.text)}</p>
      </Link>
    </motion.div>
  )
}
