import { getImage } from '../utils/images'

export const destinations = [
  { id: 1, name: 'Sharm El Sheikh', slug: 'sharm-el-sheikh', region: 'South Sinai', detail: 'Coral reefs & desert escapes', image: getImage('sharm', 0), imageKey: 'sharm', tours: 12 },
  { id: 2, name: 'Dahab', slug: 'dahab', region: 'South Sinai', detail: 'Slow days by the Red Sea', image: getImage('dahab', 1), imageKey: 'dahab', tours: 8 },
  { id: 3, name: 'Hurghada', slug: 'hurghada', region: 'Red Sea', detail: 'Island life & clear waters', image: getImage('hurghada', 2), imageKey: 'hurghada', tours: 10 },
  { id: 4, name: 'Marsa Matrouh', slug: 'marsa-matrouh', region: 'Mediterranean', detail: 'White sands, endless blue', image: getImage('matrouh', 3), imageKey: 'matrouh', tours: 6 },
  { id: 5, name: 'Alexandria', slug: 'alexandria', region: 'Mediterranean', detail: 'Culture with a sea breeze', image: getImage('alex', 0), imageKey: 'alex', tours: 7 },
]

export const fetchDestinations = () => new Promise((resolve) => {
  window.setTimeout(() => resolve(destinations), 350)
})
