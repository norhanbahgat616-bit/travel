import { Plane, Hotel, Compass, CarFront, FileCheck2, Headset } from 'lucide-react'

export const services = [
  {
    slug: 'flights', title: 'Flights', Icon: Plane, imageKey: 'flights',
    text: 'Thoughtfully planned flights that fit your journey.',
    overview: 'We take the guesswork out of getting here, helping you find convenient routes and comfortable connections that work with your dates and plans.',
    features: ['Flight options matched to your dates', 'Clear fare and baggage comparisons', 'Connection and arrival-time guidance', 'Help coordinating flights with your itinerary'],
    steps: [{ title: 'Tell us your plans', text: 'Share your departure city, preferred dates, and any flexibility.' }, { title: 'Compare your options', text: 'We’ll present practical flight choices with clear details.' }, { title: 'Travel with confidence', text: 'Get support before departure and coordination for your arrival.' }],
    faq: [{ q: 'Can you help with international flights?', a: 'Yes. Tell us your departure city and dates and our team can help you explore available options.' }, { q: 'Do you book domestic flights in Egypt?', a: 'We can help coordinate domestic flights as part of your wider trip plan.' }],
    price: 'Tailored to your route', cta: 'Plan your flights',
  },
  {
    slug: 'hotels', title: 'Hotels', Icon: Hotel, imageKey: 'hotels',
    text: 'Handpicked stays with the right kind of comfort.',
    overview: 'From a relaxed Red Sea hideaway to a characterful city stay, we’ll help find accommodation that feels right for your travel style.',
    features: ['Stays selected for location and atmosphere', 'Options for different travel styles and budgets', 'Help comparing room and board choices', 'Accommodation coordinated with your itinerary'],
    steps: [{ title: 'Tell us what matters', text: 'Let us know your dates, destination, and the kind of stay you have in mind.' }, { title: 'Explore considered stays', text: 'Review a curated shortlist with the details that matter.' }, { title: 'Settle in', text: 'We’ll coordinate your stay with the rest of your trip.' }],
    faq: [{ q: 'Can I request a specific hotel?', a: 'Absolutely. Share your preference and we’ll check how it fits your dates and trip.' }, { q: 'Can you arrange family rooms?', a: 'Tell us who is travelling and we’ll look for suitable room arrangements.' }],
    price: 'Options for every style', cta: 'Find your stay',
  },
  {
    slug: 'tours', title: 'Local tours', Icon: Compass, imageKey: 'tours',
    text: 'Meet Egypt through the people who know it best.',
    overview: 'Go beyond the guidebook with days shaped by local knowledge, meaningful places, and time to enjoy the moments in between.',
    features: ['Private and small-group experiences', 'Local guides and thoughtfully paced days', 'Options for culture, coast, and desert', 'Itineraries tailored to your interests'],
    steps: [{ title: 'Share your curiosity', text: 'Tell us what you love, what you’d like to discover, and your pace.' }, { title: 'Shape the experience', text: 'We’ll suggest local tours that fit your journey.' }, { title: 'Enjoy the day', text: 'Your guide and our team help the experience feel easy from start to finish.' }],
    faq: [{ q: 'Can tours be private?', a: 'Many experiences can be arranged privately. Let us know your group size and preference.' }, { q: 'Are tours suitable for children?', a: 'We can recommend family-friendly experiences based on the ages and interests of your group.' }],
    price: 'Depends on your experience', cta: 'Explore local tours',
  },
  {
    slug: 'transfers', title: 'Transfers', Icon: CarFront, imageKey: 'transfers',
    text: 'Easy, reliable rides from arrival to departure.',
    overview: 'Arrive knowing your ride is taken care of. We coordinate comfortable transfers around your flight times, stays, and plans.',
    features: ['Airport pick-up and drop-off coordination', 'Private point-to-point transfers', 'Multi-stop itinerary planning', 'Clear meeting and timing information'],
    steps: [{ title: 'Share your itinerary', text: 'Send your arrival, departure, and the places you need to reach.' }, { title: 'Confirm your ride', text: 'We’ll coordinate the details and make the arrangements clear.' }, { title: 'Travel smoothly', text: 'Your transfer is planned around your day, not the other way around.' }],
    faq: [{ q: 'Can you arrange an airport pick-up?', a: 'Yes. Provide your flight arrival details when you request your trip plan.' }, { q: 'Can transfers include several stops?', a: 'We can help arrange multi-stop rides to suit your itinerary.' }],
    price: 'Based on route and vehicle', cta: 'Arrange a transfer',
  },
  {
    slug: 'visa-support', title: 'Visa support', Icon: FileCheck2, imageKey: 'visa',
    text: 'Clear guidance to make travel prep feel simple.',
    overview: 'Visa rules can be confusing. Our team helps you understand the application steps and prepare your documents for your chosen destination.',
    features: ['Destination-specific application guidance', 'Personalised document checklist', 'Help understanding application stages', 'Updates when requirements need checking'],
    steps: [{ title: 'Tell us your destination', text: 'Share your nationality, destination, and expected travel date.' }, { title: 'Review your checklist', text: 'We’ll explain the common application requirements and next steps.' }, { title: 'Apply with clarity', text: 'Complete your application with a clearer understanding of the process.' }],
    faq: [{ q: 'Can you guarantee a visa decision?', a: 'No. Decisions are made by the relevant government authority. We provide guidance only.' }, { q: 'Do requirements change?', a: 'Yes. Requirements can change, so always confirm details with the official authority before applying.' }],
    price: 'Guidance from our team', cta: 'Get visa guidance',
  },
  {
    slug: 'support', title: '24/7 customer support', Icon: Headset, imageKey: 'support',
    text: 'A real local team, ready to help every day.',
    overview: 'Travel plans are better when you know someone is there. Our local team is available every day to help with the details before and during your trip.',
    features: ['Daily local assistance', 'Help with itinerary questions', 'Coordination when plans change', 'One friendly point of contact'],
    steps: [{ title: 'Get in touch', text: 'Reach our team by phone or email with your question.' }, { title: 'Talk to someone local', text: 'We’ll understand your plans and point you in the right direction.' }, { title: 'Keep enjoying your trip', text: 'We’ll help you work through the next steps.' }],
    faq: [{ q: 'How can I reach the support team?', a: 'Call 010 155 411 20 or email info@travelgolftours.com.' }, { q: 'Is support available every day?', a: 'Yes. Our support is available daily.' }],
    price: 'Here when you need us', cta: 'Talk to our team',
  },
]

export const fetchServices = () => new Promise((resolve) => {
  window.setTimeout(() => resolve(services), 350)
})
