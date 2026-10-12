import { useMemo, useState } from 'react'
import { AuthContext } from './authContext'
const USERS_KEY = 'travel-golf-users'
const SESSION_KEY = 'travel-golf-user'

function readStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredValue(SESSION_KEY, null))

  const signUp = (details) => {
    const users = readStoredValue(USERS_KEY, [])
    if (users.some((entry) => entry.email.toLowerCase() === details.email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const createdUser = { name: details.name, email: details.email.toLowerCase() }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, { ...createdUser, password: details.password }]))
    localStorage.setItem(SESSION_KEY, JSON.stringify(createdUser))
    setUser(createdUser)
    return createdUser
  }

  const signIn = (email, password) => {
    const users = readStoredValue(USERS_KEY, [])
    const match = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password)
    if (!match) throw new Error('The email or password is incorrect.')
    const nextUser = { name: match.name, email: match.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, signUp, signIn, signOut }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
