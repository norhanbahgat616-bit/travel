const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
})

const images = Object.entries(imageModules)
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([path, src]) => ({
    path,
    src,
    filename: path.split('/').at(-1).toLowerCase(),
  }))

const aliases = {
  hero: ['hero', 'sharm', 'dahab'],
  sharm: ['sharm'],
  dahab: ['dahab'],
  hurghada: ['hurghada'],
  matrouh: ['matrouh', 'marsa'],
  alex: ['alex', 'alexandria'],
  visa: ['visa'],
  turkey: ['turkey'],
  dubai: ['dubai', 'uae'],
  umrah: ['umrah', 'saudi'],
  europe: ['europe', 'schengen'],
  london: ['london', 'uk', 'britain'],
  usa: ['usa', 'united-states', 'america'],
  about: ['about'],
  contact: ['contact'],
  booking: ['booking'],
  gallery: ['gallery'],
  flights: ['flight'],
  hotels: ['hotel'],
  tours: ['tour'],
  transfers: ['transfer'],
  support: ['support'],
}

export function getImage(key = 'gallery', index = 0) {
  if (images.length === 0) return null
  const matchers = aliases[key] || [key]
  const matched = images.find((image) => matchers.some((part) => image.filename.includes(part)))
  return matched?.src || images[((index % images.length) + images.length) % images.length].src
}

export function getAllImages() {
  return images.map((image, index) => ({
    src: image.src,
    filename: image.filename,
    title: image.filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
    index,
  }))
}
