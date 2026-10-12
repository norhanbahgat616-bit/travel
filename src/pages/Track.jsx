import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Search, CircleCheck, CircleDot } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { FormField, Input } from '../components/FormField'
import { patterns, readStoredList } from '../utils/validators'

const stages = ['Received', 'In review', 'Confirmed', 'Completed']
const stateFor = (status) => ['Cancelled', 'Rejected'].includes(status) ? 0 : Math.max(0, stages.indexOf(status === 'Pending' ? 'Received' : status))

export default function Track() {
  const [records, setRecords] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const submit = ({ phone }) => setRecords([...readStoredList('bookings'), ...readStoredList('visaRequests')].filter((item) => item.phone === phone))
  return <>
    <Helmet><title>Track a Request | Travel Golf Tours</title><meta name="description" content="Track locally saved trip bookings and visa guidance requests by phone number." /></Helmet>
    <PageHeader title="Check in on your plans." subtitle="Use the phone number from your request to view its latest local status." imageKey="booking" breadcrumb={[{ label: 'Track a request' }]} />
    <section className="section-pad"><div className="section-shell max-w-3xl">
      <form className="rounded-3xl bg-white p-6 shadow-xl sm:p-8" onSubmit={handleSubmit(submit)} noValidate><h2 className="text-xl font-semibold">Find your request</h2><p className="mt-2 text-sm text-muted">This demo searches requests saved in this browser.</p><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end"><FormField label="Egyptian mobile number" error={errors.phone?.message} className="flex-1">{(id) => <Input id={id} inputMode="numeric" placeholder="01012345678" {...register('phone', { required: 'Enter the phone number used for your request.', pattern: { value: patterns.phone, message: 'Enter a valid Egyptian mobile number.' } })} />}</FormField><button className="button-primary min-h-12"><Search size={16} />Track</button></div></form>
      {records && <div className="mt-8 space-y-4">{records.length ? records.map((record) => { const current = stateFor(record.status); return <article key={record.id} className="rounded-3xl border border-[#e7efef] bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs text-muted">{record.id}</p><h2 className="mt-1 font-semibold">{record.destination || record.visaTitle || 'Travel request'}</h2><p className="mt-1 text-sm text-muted">{record.date || record.travelDate || 'Date not provided'}</p></div><span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-turquoise">{record.status}</span></div><ol className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">{stages.map((stage, index) => <li key={stage} className={`flex items-center gap-2 text-xs ${index <= current ? 'text-turquoise' : 'text-muted'}`}>{index <= current ? <CircleCheck size={17} /> : <CircleDot size={17} />}{stage}</li>)}</ol></article> }) : <div className="rounded-2xl bg-white p-8 text-center text-sm text-muted">No booking or visa request was found for that number.</div>}</div>}
    </div></section>
  </>
}
