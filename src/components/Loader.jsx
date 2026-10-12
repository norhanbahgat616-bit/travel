export function CardSkeletons({ count = 3, className = '' }) {
  return (
    <div className={className} aria-label="Loading content" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-sm" key={index}>
          <div className="skeleton h-52 w-full" />
          <div className="px-2 pb-3 pt-5">
            <div className="skeleton mb-3 h-4 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function QueryError({ onRetry }) {
  return (
    <div className="rounded-2xl border border-coral/30 bg-white p-6 text-center" role="alert">
      <p className="font-semibold">We couldn’t load this just now.</p>
      <p className="mt-2 text-sm text-muted">Please check your connection and try again.</p>
      <button className="button-outline mt-4 min-h-10 px-5 text-sm" onClick={onRetry} type="button">Try again</button>
    </div>
  )
}
