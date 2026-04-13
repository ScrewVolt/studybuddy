import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Auth() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) return
    if (mode === 'signup' && !fullName.trim()) return

    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } else {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email to confirm your account, then sign in.')
        setMode('signin')
      }
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#F8F7F4' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors mb-6 self-start"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L5 7L9 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </button>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: '#4338CA' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="6" fill="white" opacity="0.9" />
              <rect
                x="9.5" y="15" width="5" height="2" rx="1"
                fill="white" opacity="0.6"
              />
              <rect
                x="10.5" y="18" width="3" height="1.5" rx="0.75"
                fill="white" opacity="0.4"
              />
            </svg>
          </div>
          <h1 className="text-[20px] font-medium text-gray-900">StudyBuddy</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Your AI learning companion
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: '0.5px solid #e5e7eb' }}
        >
          {/* Tab toggle */}
          <div
            className="flex rounded-lg p-0.5 mb-5"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => {
                  setMode(m)
                  setError(null)
                  setMessage(null)
                }}
                className="flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all"
                style={
                  mode === m
                    ? { backgroundColor: 'white', color: '#4338CA' }
                    : { color: '#9CA3AF' }
                }
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">

            {mode === 'signup' && (
              <div>
                <label className="text-[12px] font-medium text-gray-500 block mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Miguel Garza"
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] text-gray-800 outline-none transition-colors"
                  style={{
                    border: '0.5px solid #e5e7eb',
                    backgroundColor: '#FAFAFA',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#818CF8')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            )}

            <div>
              <label className="text-[12px] font-medium text-gray-500 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg text-[13px] text-gray-800 outline-none transition-colors"
                style={{
                  border: '0.5px solid #e5e7eb',
                  backgroundColor: '#FAFAFA',
                }}
                onFocus={e => (e.target.style.borderColor = '#818CF8')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-gray-500 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] text-gray-800 outline-none transition-colors"
                style={{
                  border: '0.5px solid #e5e7eb',
                  backgroundColor: '#FAFAFA',
                }}
                onFocus={e => (e.target.style.borderColor = '#818CF8')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            {error && (
              <div
                className="px-3 py-2.5 rounded-lg text-[12px]"
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  border: '0.5px solid #FECACA',
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                className="px-3 py-2.5 rounded-lg text-[12px]"
                style={{
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  border: '0.5px solid #D1FAE5',
                }}
              >
                {message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-90 disabled:opacity-50 mt-1"
              style={{ backgroundColor: '#4338CA', color: 'white' }}
            >
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          Your learning data stays private and secure.
        </p>
      </div>
    </div>
  )
}