import { readStoredList } from '../utils/validators'

export const mockBookings = [
  { id: 'TGT-2048', name: 'Mariam Hassan', destination: 'Sharm El Sheikh', date: '18 Nov 2026', travelers: 2, status: 'Confirmed' },
  { id: 'TGT-2047', name: 'Omar Nabil', destination: 'Dahab', date: '21 Nov 2026', travelers: 1, status: 'Pending' },
  { id: 'TGT-2046', name: 'Laila Samir', destination: 'Hurghada', date: '25 Nov 2026', travelers: 4, status: 'Confirmed' },
]

export const fetchBookings = () => new Promise((resolve) => {
  const removed = new Set(readStoredList('deletedTravelRecords'))
  window.setTimeout(() => resolve([...readStoredList('bookings'), ...mockBookings.filter((item) => !removed.has(item.id))]), 350)
})

export const fetchVisaRequests = () => new Promise((resolve) => {
  window.setTimeout(() => resolve(readStoredList('visaRequests')), 350)
})
