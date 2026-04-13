import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS, SUBJECT_NAMES } from '../utils/subjects'
import { useProgress } from '../hooks/useProgress'

const getSessionKey = (subject) => `studybuddy_session_${subject || 'default'}`

export default function Sessions() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const sessions = useMemo(() => {
    const loaded = []
    SUBJECT_NAMES.forEach(subject => {
      try {
        const saved = localStorage.getItem(getSessionKey(subject))
        if (!saved) return
        const parsed = JSON.parse(saved)
        if (!parsed.messages || parsed.messages.length === 0) return
        const userMessages = parsed.messages.filter(m => m.role === 'user')
        if (userMessages.length === 0) return
        loaded.push({
          subject,
          messages: parsed.messages,
          sessionQuestions: parsed.sessionQuestions || 0,
          questionActive: parsed.questionActive || false,
          userMessages,
          messageCount: parsed.messages.length,
        })
      } catch {
        // skip malformed session
      }
    })
    return loaded
  }, [])

  return (
    <div className="page-enter min-h-screen" style={{ backgroundColor: '#F8F7F4' }}>

      {/* Header */}
      <div
        className="bg-white px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: '0.5px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
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
            Back to dashboard
          </button>
          <div className="w-px h-4" style={{ backgroundColor: '#e5e7eb' }} />
          <div>
            <div className="text-[15px] font-medium text-gray-900">
              My Sessions
            </div>
            <div className="text-[12px] text-gray-400">
              {sessions.length} active session{sessions.length !== 1 ? 's' : ''} saved
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#4338CA', color: 'white' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M6.5 2v9M2 6.5h9"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New session
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-4">

        {/* Empty state */}
        {sessions.length === 0 && (
          <div
            className="bg-white rounded-2xl p-12 text-center"
            style={{ border: '0.5px solid #e5e7eb' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#EEF2FF' }}
            >
              <svg
                width="22" height="22" viewBox="0 0 22 22"
                fill="none" stroke="#4338CA" strokeWidth="1.5"
              >
                <path d="M4 6h14M4 11h9M4 16h11" />
              </svg>
            </div>
            <div className="text-[14px] font-medium text-gray-700 mb-1">
              No sessions yet
            </div>
            <div className="text-[13px] text-gray-400 mb-5">
              Start a session from the dashboard to see it here.
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="text-[13px] font-medium px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
            >
              Start your first session →
            </button>
          </div>
        )}

        {/* Session cards */}
        {sessions.map(session => {
          const config = SUBJECTS[session.subject] || SUBJECTS.Mathematics
          const preview = session.userMessages[0]?.content || 'No messages yet'
          const hintsUsed = (progress.recentActivity || [])
            .filter(a => a.subject === session.subject)
            .reduce((sum, a) => sum + (a.hintsUsed || 0), 0)

          return (
            <div
              key={session.subject}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '0.5px solid #e5e7eb' }}
            >
              {/* Card header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '0.5px solid #f3f4f6' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.lightColor }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-gray-900">
                      {session.subject}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {session.userMessages.length} question{session.userMessages.length !== 1 ? 's' : ''} asked
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.questionActive && (
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
                    >
                      In progress
                    </span>
                  )}
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: config.lightColor,
                      color: config.color,
                    }}
                  >
                    {session.messageCount} messages
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="px-5 py-3">
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                  First question
                </div>
                <div className="text-[13px] text-gray-600 leading-relaxed truncate">
                  "{preview}"
                </div>
              </div>

              {/* Stats row */}
              <div
                className="px-5 py-3 flex items-center gap-6"
                style={{ borderTop: '0.5px solid #f9fafb' }}
              >
                <div>
                  <div className="text-[11px] text-gray-400 mb-0.5">Messages</div>
                  <div className="text-[13px] font-medium text-gray-900">
                    {session.messageCount}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 mb-0.5">Hints used</div>
                  <div className="text-[13px] font-medium text-gray-900">
                    {hintsUsed}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 mb-0.5">Questions asked</div>
                  <div className="text-[13px] font-medium text-gray-900">
                    {session.sessionQuestions}
                  </div>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() =>
                      navigate('/chat', { state: { subject: session.subject } })
                    }
                    className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: config.lightColor,
                      color: config.color,
                    }}
                  >
                    Resume →
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Overall stats footer */}
        {sessions.length > 0 && (
          <div
            className="bg-white rounded-2xl p-5"
            style={{ border: '0.5px solid #e5e7eb' }}
          >
            <div className="text-[13px] font-medium text-gray-700 mb-3">
              Overall stats
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[22px] font-medium text-gray-900 leading-none mb-1">
                  {progress.totalQuestions || 0}
                </div>
                <div className="text-[12px] text-gray-400">
                  Total questions asked
                </div>
              </div>
              <div>
                <div
                  className="text-[22px] font-medium leading-none mb-1"
                  style={{ color: '#059669' }}
                >
                  {progress.conceptsMastered || 0}
                </div>
                <div className="text-[12px] text-gray-400">
                  Concepts mastered
                </div>
              </div>
              <div>
                <div
                  className="text-[22px] font-medium leading-none mb-1"
                  style={{ color: '#D97706' }}
                >
                  {progress.streak || 0}
                </div>
                <div className="text-[12px] text-gray-400">Day streak</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}