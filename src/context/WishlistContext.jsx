import { useCallback, useMemo, useState } from 'react'
import { WishlistContext } from './wishlist-context'
import { showAlert } from '../utils/alert'
const KEY = 'tgt-wishlist'

function loadItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadItems)
  const toggle = useCallback((item) => {
    const found = items.some((saved) => saved.type === item.type && saved.slug === item.slug)
    const next = found ? items.filter((saved) => saved.type !== item.type || saved.slug !== item.slug) : [...items, item]
    localStorage.setItem(KEY, JSON.stringify(next))
    setItems(next)
    void showAlert({ toast: true, position: 'top-end', timer: 1800, showConfirmButton: false, icon: found ? 'info' : 'success', title: found ? 'Removed from wishlist' : 'Added to wishlist' })
  }, [items])
  const remove = useCallback((type, slug) => {
    const next = items.filter((saved) => saved.type !== type || saved.slug !== slug)
    localStorage.setItem(KEY, JSON.stringify(next))
    setItems(next)
  }, [items])
  const isSaved = useCallback((type, slug) => items.some((saved) => saved.type === type && saved.slug === slug), [items])
  const value = useMemo(() => ({ items, count: items.length, toggle, remove, isSaved }), [items, toggle, remove, isSaved])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
