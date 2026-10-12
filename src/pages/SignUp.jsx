import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm, useWatch } from 'react-hook-form'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { showAlert } from '../utils/alert'
import AuthLayout, { AuthField } from './AuthLayout'
import { useAuth } from '../context/useAuth'
import { patterns, validationMessages } from '../utils/validators'

export default function SignUp() {
  const { signUp, user } = useAuth()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm()
  const passwordValue = useWatch({ control, name: 'password' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  if (user) return <Navigate to="/dashboard" replace />

  const submit = async (details) => {
    try {
      const account = signUp(details)
      await showAlert({ icon: 'success', title: 'Welcome to Travel Golf Tours', text: `Your account is ready, ${account.name.split(' ')[0]}.`, confirmButtonColor: '#19A7A0' })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      await showAlert({ icon: 'error', title: 'We couldn’t create your account', text: error.message, confirmButtonColor: '#FF8A65' })
    }
  }

  return (
    <>
      <Helmet><title>Sign Up | Travel Golf Tours</title><meta name="description" content="Create your Travel Golf Tours account and start planning a personal Egypt escape." /></Helmet>
      <AuthLayout mode="signup">
        <p className="eyebrow">A little wonder is waiting</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Let’s get to know you.</h2>
        <p className="mt-2 text-sm text-muted">Create an account and start planning your Egypt escape.</p>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <AuthField id="signup-name" label="Full name" placeholder="e.g. Sara Ahmed" error={errors.name?.message} {...register('name', { required: 'Please enter your name.', pattern: { value: patterns.name, message: validationMessages.name } })} />
          <AuthField id="signup-email" label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Please enter your email.', pattern: { value: patterns.email, message: validationMessages.email } })} />
          <div className="form-field">
            <label className="field-label" htmlFor="signup-password">Password</label>
            <div className="relative"><input id="signup-password" className="field-input pr-12" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" aria-invalid={Boolean(errors.password)} {...register('password', { required: 'Please create a password.', pattern: { value: patterns.password, message: validationMessages.password } })} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-navy" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            {errors.password && <p className="field-error" role="alert">{errors.password.message}</p>}
          </div>
          <div className="form-field">
            <label className="field-label" htmlFor="signup-confirm">Confirm password</label>
            <div className="relative"><input id="signup-confirm" className="field-input pr-12" type={showConfirm ? 'text' : 'password'} placeholder="Type your password again" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword', { required: 'Please confirm your password.', validate: (value) => value === passwordValue || 'Your passwords do not match.' })} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-navy" aria-label={showConfirm ? 'Hide password confirmation' : 'Show password confirmation'} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            {errors.confirmPassword && <p className="field-error" role="alert">{errors.confirmPassword.message}</p>}
          </div>
          <button className="button-primary w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating your account…' : 'Create account'} <ArrowRight size={17} /></button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/signin" className="font-semibold text-turquoise hover:underline">Sign in</Link></p>
      </AuthLayout>
    </>
  )
}
