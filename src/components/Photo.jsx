import { useState } from 'react'

export default function Photo({ src, alt, className = '', imageClassName = '', loading = 'lazy', ...props }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-navy via-turquoise to-sun ${className}`} {...props}>
      {src && !failed && !loaded && <span aria-hidden="true" className="skeleton absolute inset-0 z-10 rounded-[inherit]" />}
      {src && !failed && <img src={src} alt={alt} width="1200" height="800" decoding="async" loading={loading} fetchPriority={loading === 'eager' ? 'high' : 'auto'} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className={`h-full w-full object-cover transition-[filter,opacity] duration-500 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'} ${imageClassName}`} />}
      {!src && <span className="sr-only">{alt}</span>}
    </div>
  )
}
