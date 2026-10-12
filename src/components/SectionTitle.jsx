import { useLanguage } from '../context/useLanguage'

export default function SectionTitle({ eyebrow, title, description, light = false, align = 'center' }) {
  const { t } = useLanguage()
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
      <p className={`inline-flex rounded-full bg-mist px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-turquoise ${light ? 'bg-white/10 text-sun' : ''}`}>{t(eyebrow)}</p>
      <h2 className={`section-heading ${light ? 'text-white' : ''}`}>{t(title)}</h2>
      {description && <p className={`section-copy ${light ? 'text-white/70' : ''} ${align === 'center' ? '' : 'mx-0'}`}>{t(description)}</p>}
    </div>
  )
}
