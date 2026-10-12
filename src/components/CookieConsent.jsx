import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('tgt-privacy-choice'))
  const { t } = useLanguage()
  const save = (choice) => {
    localStorage.setItem('tgt-privacy-choice', choice)
    setVisible(false)
  }
  if (!visible) return null
  return <aside className="fixed bottom-4 start-4 z-50 max-w-sm rounded-2xl border border-[#e7efef] bg-white p-5 shadow-2xl print-hidden" aria-label="Privacy preferences"><p className="text-sm font-semibold">{t('Cookie preferences')}</p><p className="mt-1 text-xs leading-5 text-muted"><Link className="text-turquoise underline" to="/privacy">Privacy details</Link></p><div className="mt-4 flex gap-2"><button className="button-primary min-h-10 flex-1 text-xs" onClick={() => save('accepted')}>{t('Accept')}</button><button className="button-outline min-h-10 flex-1 text-xs" onClick={() => save('declined')}>{t('Decline')}</button></div></aside>
}
