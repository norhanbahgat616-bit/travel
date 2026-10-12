import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/useWishlist'
import { useCurrency } from '../context/useCurrency'
import { tours } from '../data/tours'
import { destinations } from '../data/destinations'
import { visas } from '../data/visas'
import PageHeader from '../components/PageHeader'
import Photo from '../components/Photo'

export default function Wishlist() {
  const { items, remove } = useWishlist()
  const { formatPrice } = useCurrency()
  return <>
    <Helmet><title>Wishlist | Travel Golf Tours</title><meta name="description" content="Review the trips and places you saved for later." /></Helmet>
    <PageHeader title="Your saved places." subtitle="Keep your favourite ideas close while you plan." imageKey="gallery" breadcrumb={[{ label: 'Wishlist' }]} />
    <section className="section-pad"><div className="section-shell">
      {items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => {
        const source = item.type === 'tour' ? tours.find((entry) => entry.slug === item.slug) : item.type === 'destination' ? destinations.find((entry) => entry.slug === item.slug) : visas.find((entry) => entry.slug === item.slug)
        return <article key={`${item.type}:${item.slug}`} className="overflow-hidden rounded-3xl border border-[#e7efef] bg-white"><Link to={item.path || `/trips/${item.slug}`}><Photo src={item.image || source?.image} alt={item.title} className="h-48" /></Link><div className="p-5"><p className="text-xs capitalize text-turquoise">{item.type}</p><h2 className="mt-1 text-lg font-semibold">{item.title}</h2><p className="mt-1 text-sm text-muted">{item.place || source?.country || ''}</p>{item.type === 'tour' && source && <p className="mt-2 text-sm font-semibold">{formatPrice(source.price)}</p>}<div className="mt-4 flex gap-2"><Link className="button-primary min-h-10 flex-1" to={item.path || `/trips/${item.slug}`}>View details</Link><button className="button-outline min-h-10 px-3" onClick={() => remove(item.type, item.slug)} aria-label={`Remove ${item.title} from wishlist`}><Trash2 size={16} /></button></div></div></article>
      })}</div> : <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-lg"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist text-turquoise"><Heart size={26} /></span><h2 className="mt-5 text-2xl font-semibold">No saved favorites yet</h2><p className="mt-2 text-sm text-muted">Save destinations, trips, and visa guides as you explore.</p><Link to="/trips" className="button-primary mt-6">Browse trips</Link></div>}
    </div></section>
  </>
}
