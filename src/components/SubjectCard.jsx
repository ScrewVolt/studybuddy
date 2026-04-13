import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../utils/subjects'

export default function SubjectCard({ subject, count, isActive }) {
  const navigate = useNavigate()
  const config = SUBJECTS[subject]

  const icons = {
    Mathematics: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={config.color} strokeWidth="1.5">
        <path d="M4 10h12M10 4v12" />
        <circle cx="10" cy="10" r="7" />
      </svg>
    ),
    Science: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={config.color} strokeWidth="1.5">
        <path d="M10 3c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z" />
        <path d="M10 11v5" />
      </svg>
    ),
    History: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={config.color} strokeWidth="1.5">
        <path d="M4 5h12M4 10h8M4 15h10" />
        <circle cx="15" cy="15" r="2" />
      </svg>
    ),
    English: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        stroke={config.color} strokeWidth="1.5">
        <path d="M4 6h12M4 10h9M4 14h7" />
        <path d="M15 12l2 2-2 2" />
      </svg>
    ),
  }

  const totalForSubject = count || 0
  const maxQuestions = 20
  const progressPct = Math.min((totalForSubject / maxQuestions) * 100, 100)

  function handleStart() {
    navigate('/chat', { state: { subject } })
  }

  return (
    <div
      onClick={handleStart}
      className="bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm group"
      style={{
        border: isActive
          ? `2px solid ${config.color}`
          : `0.5px solid #e5e7eb`,
        borderTop: `2px solid ${config.color}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: config.lightColor }}
      >
        {icons[subject]}
      </div>

      <div className="text-[14px] font-medium text-gray-900 mb-0.5">
        {subject}
      </div>
      <div className="text-[12px] text-gray-400 mb-3">
        {SUBJECTS[subject].topics.slice(0, 3).join(' · ')}
      </div>

      <div className="h-1 rounded-full bg-gray-100 mb-3">
        <div
          className="h-1 rounded-full transition-all"
          style={{
            width: `${progressPct}%`,
            backgroundColor: config.color,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {totalForSubject} question{totalForSubject !== 1 ? 's' : ''} answered
        </span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: config.lightColor }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3"
              stroke={config.color} strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}