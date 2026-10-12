import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { showAlert } from '../utils/alert'
import AuthLayout, { AuthField } from './AuthLayout'
import { useAuth } from '../context/useAuth'
import { patterns, validationMessages } from '../utils/validators'

export default function SignIn() {
  const { signIn, user } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  if (user) return <Navigate to="/dashboard" replace />

  const submit = async ({ email, password }) => {
    try {
      signIn(email, password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (error) {
      await showAlert({ icon: 'error', title: 'Couldn’t sign you in', text: error.message, confirmButtonColor: '#FF8A65' })
    }
  }

  return (
    <>
      <Helmet><title>Sign In | Travel Golf Tours</title><meta name="description" content="Sign in to manage your Travel Golf Tours account and upcoming Egypt journeys." /></Helmet>
      <AuthLayout mode="signin">
        <p className="eyebrow">Your next adventure awaits</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Good to have you back.</h2>
        <p className="mt-2 text-sm text-muted">Sign in to pick up where you left off.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)} noValidate>
          <AuthField id="signin-email" label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Please enter your email.', pattern: { value: patterns.email, message: validationMessages.email } })} />
          <div className="form-field">
            <label className="field-label" htmlFor="signin-password">Password</label>
            <div className="relative"><input id="signin-password" className="field-input pr-12" type={showPassword ? 'text' : 'password'} placeholder="Your password" aria-invalid={Boolean(errors.password)} {...register('password', { required: 'Please enter your password.' })} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-navy" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            {errors.password && <p className="field-error" role="alert">{errors.password.message}</p>}
          </div>
          <button className="button-primary w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={17} /></button>
        </form>
        <p className="mt-7 text-center text-sm text-muted">New around here? <Link to="/signup" className="font-semibold text-turquoise hover:underline">Create an account</Link></p>
        <p className="mt-8 text-center text-xs text-muted">By continuing, you agree to travel thoughtfully and leave room for wonder.</p>
      </AuthLayout>
    </>
  )
}
