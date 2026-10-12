import Swal from 'sweetalert2'
import { ar } from '../i18n/ar'

export function showAlert(options) {
  const arabic = localStorage.getItem('tgt-language') === 'ar'
  const dark = localStorage.getItem('tgt-theme') === 'dark'
  const translate = (value) => arabic && typeof value === 'string' ? ar[value] || value : value
  return Swal.fire({
    background: dark ? '#183B4E' : '#ffffff',
    color: dark ? '#f4f8f9' : '#183B4E',
    ...options,
    title: translate(options.title),
    text: translate(options.text),
    confirmButtonText: translate(options.confirmButtonText || 'OK'),
    cancelButtonText: translate(options.cancelButtonText || 'Cancel'),
  })
}
