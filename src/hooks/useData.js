import { useQuery } from '@tanstack/react-query'
import { fetchDestinations } from '../data/destinations'
import { fetchTours } from '../data/tours'
import { fetchServices } from '../data/services'
import { fetchVisas } from '../data/visas'
import { fetchBookings, fetchVisaRequests } from '../data/dashboard'

export const useDestinations = () => useQuery({ queryKey: ['destinations'], queryFn: fetchDestinations })
export const useTours = () => useQuery({ queryKey: ['tours'], queryFn: fetchTours })
export const useServices = () => useQuery({ queryKey: ['services'], queryFn: fetchServices })
export const useVisas = () => useQuery({ queryKey: ['visas'], queryFn: fetchVisas })
export const useBookings = () => useQuery({ queryKey: ['bookings'], queryFn: fetchBookings })
export const useVisaRequests = () => useQuery({ queryKey: ['visaRequests'], queryFn: fetchVisaRequests })
