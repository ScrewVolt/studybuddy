import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F8F7F4' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="8" r="5" fill="#4338CA" opacity="0.9" />
              <rect
                x="7.5" y="12.5" width="5" height="1.5" rx="0.75"
                fill="#4338CA" opacity="0.6"
              />
            </svg>
          </div>
          <div className="text-[13px] text-gray-400">Loading StudyBuddy...</div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return children
}