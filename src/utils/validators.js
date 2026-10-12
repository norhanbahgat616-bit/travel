export const patterns = {
  name: /^[A-Za-z\u0600-\u06FF\s]{3,40}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^01[0125][0-9]{8}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
}

export const validationMessages = {
  name: 'Enter 3–40 letters (Arabic or English).',
  email: 'Enter a valid email address.',
  phone: 'Enter an Egyptian mobile number, e.g. 01012345678.',
  password: 'Use at least 8 characters, including a letter and a number.',
}

export const validateFutureDate = (value) => {
  if (!value) return 'Please choose a travel date.'
  const chosenDate = new Date(`${value}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return (!Number.isNaN(chosenDate.getTime()) && chosenDate >= today) || 'Travel date cannot be in the past.'
}

export const validateTravelers = (value) => {
  const count = Number(value)
  return (Number.isInteger(count) && count >= 1 && count <= 20) || 'Choose between 1 and 20 travelers.'
}

export const validateMessage = (value) => (
  (typeof value === 'string' && value.trim().length >= 10 && value.trim().length <= 600)
  || 'Message must be between 10 and 600 characters.'
)

export const readStoredList = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export const saveStoredRecord = (key, record) => {
  const list = readStoredList(key)
  const next = [record, ...list]
  localStorage.setItem(key, JSON.stringify(next))
  return next
}

export const createRecordId = (prefix) => `${prefix}-${Date.now()}`
