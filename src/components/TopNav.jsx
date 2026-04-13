import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function TopNav({ progress }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const { user, signOut } = useAuth()

  return (
    <nav className="h-14 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between flex-shrink-0">

      <div className="flex items-center gap-3 md:gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#4338CA' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6.5" r="4" fill="white" opacity="0.9" />
              <rect x="6.5" y="9.5" width="3" height="1.2" rx="0.6" fill="white" opacity="0.6" />
              <rect x="7" y="11" width="2" height="1.2" rx="0.6" fill="white" opacity="0.4" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-gray-900">StudyBuddy</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'My Sessions', path: '/sessions' },
            { label: 'Progress', path: '/progress' },
            { label: 'Teacher View', path: '/teacher' },
            { label: 'Guide', path: '/landing' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
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

        {/* Mobile shortcut buttons */}
        <div className="flex md:hidden items-center gap-1.5">
          {[
            { label: 'Home', path: '/dashboard' },
            { label: 'Chat', path: '/chat' },
            { label: 'Guide', path: '/landing' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="px-2.5 py-1 rounded-md text-[12px] transition-colors"
              style={
                isActive(path)
                  ? { color: '#4338CA', backgroundColor: '#EEF2FF', fontWeight: 500 }
                  : { color: '#6B7280' }
              }
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Streak — hidden on mobile */}
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

        {/* User avatar + sign out */}
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
  )
}