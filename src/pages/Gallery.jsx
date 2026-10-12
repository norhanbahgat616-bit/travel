import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import Photo from '../components/Photo'
import { getAllImages } from '../utils/images'

export default function Gallery() {
  const [selected, setSelected] = useState(null)
  const images = getAllImages()
  useEffect(() => {
    if (selected === null) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowRight') setSelected((current) => (current + 1) % images.length)
      if (event.key === 'ArrowLeft') setSelected((current) => (current - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, images.length])
  return (
    <>
      <Helmet><title>Gallery | Travel Golf Tours</title><meta name="description" content="See Egypt through the Travel Golf Tours photo gallery." /></Helmet>
      <PageHeader title="Postcards from Egypt." subtitle="A few of the places, colours, and quiet moments waiting along the way." imageKey="gallery" breadcrumb={[{ label: 'Gallery' }]} />
      <section className="section-pad"><div className="section-shell"><Reveal><SectionTitle eyebrow="A little glimpse" title="The view, your way." description="Every image in our travel collection, gathered from places we love." /></Reveal>
        {images.length ? <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{images.map((image, index) => <Reveal delay={(index % 8) * .04} key={image.filename}><button className="group block w-full overflow-hidden rounded-2xl bg-mist text-left" onClick={() => setSelected(index)} aria-label={`Open photo: ${image.title}`}><Photo src={image.src} alt={image.title || 'Egypt travel photograph'} className={`h-48 transition-transform duration-700 group-hover:scale-105 sm:h-60 ${index % 5 === 0 ? 'lg:h-72' : ''}`} /><span className="block truncate px-3 py-3 text-xs font-medium text-muted">{image.title || 'Egypt, by heart'}</span></button></Reveal>)}</div> : <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3"><Photo src={null} alt="Travel Golf Tours Egypt gallery" className="h-52 rounded-2xl sm:h-64" /></div>}
      </div></section>
      <AnimatePresence>
        {selected !== null && images[selected] && <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071821]/95 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label={images[selected].title}>
          <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close gallery" onClick={() => setSelected(null)}><X size={21} /></button>
          <button className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-8" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + images.length) % images.length) }}><ChevronLeft /></button>
          <motion.figure className="max-h-[85vh] max-w-5xl" initial={{ scale: .96 }} animate={{ scale: 1 }} onClick={(event) => event.stopPropagation()}><Photo src={images[selected].src} alt={images[selected].title || 'Egypt travel photograph'} className="max-h-[78vh] rounded-2xl" /><figcaption className="mt-4 text-center text-sm text-white/75">{images[selected].title}</figcaption></motion.figure>
          <button className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-8" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % images.length) }}><ChevronRight /></button>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}
