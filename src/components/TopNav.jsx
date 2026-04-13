import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function TopNav({ progress }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Sessions', path: '/sessions' },
    { label: 'Progress', path: '/progress' },
    { label: 'Teacher View', path: '/teacher' },
    { label: 'Guide', path: '/landing' },
  ]

  function handleNavigate(path) {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <div className="relative flex-shrink-0">
      <nav className="h-14 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between">

        <div className="flex items-center gap-3 md:gap-6">

          {/* Logo — tappable on mobile to open menu */}
          <button
            className="flex items-center gap-2.5 focus:outline-none"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity"
              style={{ backgroundColor: '#4338CA', opacity: menuOpen ? 0.85 : 1 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="6.5" r="4" fill="white" opacity="0.9" />
                <rect x="6.5" y="9.5" width="3" height="1.2" rx="0.6" fill="white" opacity="0.6" />
                <rect x="7" y="11" width="2" height="1.2" rx="0.6" fill="white" opacity="0.4" />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-gray-900">StudyBuddy</span>
            {/* Mobile chevron indicator */}
            <svg
              className="md:hidden w-3.5 h-3.5 text-gray-400 transition-transform"
              style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              viewBox="0 0 14 14" fill="none"
            >
              <path
                d="M3 5l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => handleNavigate(path)}
                className={`px-3 py-1.5 rounded-md text-[13px] transition-colors ${isActive(path) ? 'font-medium' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                style={
                  isActive(path)
                    ? { color: '#4338CA', backgroundColor: '#EEF2FF' }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </div>

        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">

          {progress?.streak > 0 && (
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-medium"
              style={{
                backgroundColor: '#FFFBEB',
                borderColor: '#FDE68A',
                color: '#D97706',
              }}
            >
              <span>🔥</span>
              <span>{progress.streak}-day streak</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0"
              style={{ backgroundColor: '#4338CA' }}
            >
              {user?.user_metadata?.full_name
                ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : user?.email?.slice(0, 2).toUpperCase() || 'SB'}
            </div>
            <button
              onClick={signOut}
              className="hidden md:block text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-14 left-0 right-0 bg-white z-50 px-4 py-3 flex flex-col gap-1"
          style={{ borderBottom: '0.5px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
        >
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] text-left transition-colors"
              style={
                isActive(path)
                  ? { backgroundColor: '#EEF2FF', color: '#4338CA', fontWeight: 500 }
                  : { color: '#374151' }
              }
            >
              <span>{label}</span>
              {isActive(path) && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#4338CA' }}
                />
              )}
            </button>
          ))}

          {/* Streak row inside dropdown on mobile */}
          {progress?.streak > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              <span style={{ fontSize: 14 }}>🔥</span>
              <span className="text-[13px] font-medium" style={{ color: '#D97706' }}>
                {progress.streak}-day streak
              </span>
            </div>
          )}

          {/* Sign out row */}
          <button
            onClick={() => { signOut(); setMenuOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 rounded-lg text-[14px] text-left transition-colors"
            style={{ color: '#9CA3AF' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign out
          </button>
        </div>
      )}

      {/* Backdrop to close menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}