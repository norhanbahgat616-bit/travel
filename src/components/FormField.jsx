import { useId } from 'react'
import { useLanguage } from '../context/useLanguage'

export function FormField({ label, error, children, className = '' }) {
  const id = useId()
  const { t } = useLanguage()
  return (
    <div className={`form-field ${className}`}>
      <label className="field-label" htmlFor={id}>{t(label)}</label>
      {typeof children === 'function' ? children(id) : children}
      {error && <p className="field-error" role="alert">{t(error)}</p>}
    </div>
  )
}

export function Input({ error, ...props }) {
  return <input className="field-input" aria-invalid={Boolean(error)} {...props} />
}

export function Select({ error, children, ...props }) {
  return <select className="field-input" aria-invalid={Boolean(error)} {...props}>{children}</select>
}

export function Textarea({ error, ...props }) {
  return <textarea className="field-input min-h-32 resize-y" aria-invalid={Boolean(error)} {...props} />
}
