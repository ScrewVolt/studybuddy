import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import TeacherView from './pages/TeacherView'
import Sessions from './pages/Sessions'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F8F7F4' }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: '#EEF2FF' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div className="text-[16px] font-medium text-gray-700 mb-1">
        Page not found
      </div>
      <div className="text-[13px] text-gray-400 mb-5">
        This page doesn't exist yet.
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
        style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
      >
        Back to dashboard
      </button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/teacher" element={<TeacherView />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/sessions" element={<Sessions />} />
      </Routes>
    </BrowserRouter>
  )
}