import { useEffect, useMemo, useState } from 'react'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'
import { LanguageContext } from './language-context'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('tgt-language') === 'ar' ? 'ar' : 'en')
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('rtl', language === 'ar')
    localStorage.setItem('tgt-language', language)
  }, [language])
  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === 'en' ? 'ar' : 'en'),
    t: (text) => (language === 'ar' ? ar[text] || text : en[text] || text),
  }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
