import { useCallback, useMemo, useState } from 'react'
import { currencyRates } from '../data/pricing'
import { CurrencyContext } from './currency-context'
export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const stored = localStorage.getItem('tgt-currency')
    return stored && Object.hasOwn(currencyRates, stored) ? stored : 'EGP'
  })
  const chooseCurrency = useCallback((value) => {
    if (!Object.hasOwn(currencyRates, value)) return
    setCurrency(value)
    localStorage.setItem('tgt-currency', value)
  }, [])
  const formatPrice = useCallback((egp) => {
    const { rate, locale } = currencyRates[currency] || currencyRates.EGP
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(egp * rate)
  }, [currency])
  const value = useMemo(() => ({ currency, chooseCurrency, formatPrice }), [currency, chooseCurrency, formatPrice])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
