import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { SUBJECTS, SUBJECT_NAMES } from '../utils/subjects'

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function Progress() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  const totalHints = progress.recentActivity.reduce(
    (sum, a) => sum + (a.hintsUsed || 0), 0
  )

  const avgHints = progress.totalQuestions > 0
    ? (totalHints / progress.totalQuestions).toFixed(1)
    : 0

  const independenceScore = Math.max(
    0,
    Math.round(100 - (avgHints / 5) * 100)
  )

  const independenceLabel =
    independenceScore >= 80
      ? 'Excellent'
      : independenceScore >= 60
        ? 'Good'
        : independenceScore >= 40
          ? 'Developing'
          : 'Needs support'

  const independenceColor =
    independenceScore >= 80
      ? '#059669'
      : independenceScore >= 60
        ? '#4338CA'
        : independenceScore >= 40
          ? '#D97706'
          : '#DC2626'

  // Build last 7 days activity map
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: d.toDateString(),
      count: 0,
    }
  })

  progress.recentActivity.forEach(a => {
    const dayStr = new Date(a.timestamp).toDateString()
    const match = last7Days.find(d => d.dateStr === dayStr)
    if (match) match.count += 1
  })

  const maxCount = Math.max(...last7Days.map(d => d.count), 1)

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
              My Progress
            </div>
            <div className="text-[12px] text-gray-400">
              {progress.totalQuestions > 0
                ? `${progress.totalQuestions} questions answered across all subjects`
                : 'Start a session to see your progress'}
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
          Start studying
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Empty state */}
        {progress.totalQuestions === 0 && (
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
                <path d="M11 4v14M4 11h14" />
              </svg>
            </div>
            <div className="text-[14px] font-medium text-gray-700 mb-1">
              No progress yet
            </div>
            <div className="text-[13px] text-gray-400 mb-5">
              Complete your first session to start tracking progress.
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

        {progress.totalQuestions > 0 && (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  value: progress.totalQuestions,
                  label: 'Questions answered',
                  color: '#4338CA',
                  bg: '#EEF2FF',
                },
                {
                  value: progress.conceptsMastered,
                  label: 'Concepts mastered',
                  color: '#059669',
                  bg: '#ECFDF5',
                },
                {
                  value: `${progress.streak}d`,
                  label: 'Current streak',
                  color: '#D97706',
                  bg: '#FFFBEB',
                },
                {
                  value: `${independenceScore}%`,
                  label: `Independence — ${independenceLabel}`,
                  color: independenceColor,
                  bg: '#F8F7F4',
                },
              ].map(({ value, label, color, bg }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: bg, border: `0.5px solid ${color}22` }}
                >
                  <div
                    className="text-[26px] font-medium leading-none mb-1"
                    style={{ color }}
                  >
                    {value}
                  </div>
                  <div className="text-[12px] text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Activity + subject breakdown */}
            <div className="grid grid-cols-2 gap-4">

              {/* 7-day activity */}
              <div
                className="bg-white rounded-2xl p-5"
                style={{ border: '0.5px solid #e5e7eb' }}
              >
                <div className="text-[14px] font-medium text-gray-900 mb-4">
                  Activity — last 7 days
                </div>
                <div className="flex items-end gap-2 h-28">
                  {last7Days.map(({ label, count }) => (
                    <div
                      key={label}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <div className="text-[11px] text-gray-400">
                        {count > 0 ? count : ''}
                      </div>
                      <div
                        className="w-full transition-all"
                        style={{
                          height: `${Math.max((count / maxCount) * 72, count > 0 ? 8 : 3)}px`,
                          backgroundColor: count > 0 ? '#4338CA' : '#e5e7eb',
                          opacity: count > 0 ? 0.7 + (count / maxCount) * 0.3 : 1,
                          borderRadius: '4px 4px 2px 2px',
                        }}
                      />
                      <div className="text-[11px] text-gray-400">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Streak callout */}
                {progress.streak > 0 && (
                  <div
                    className="mt-4 flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: '#FFFBEB', border: '0.5px solid #FDE68A' }}
                  >
                    <span style={{ fontSize: 16 }}>🔥</span>
                    <div className="text-[12px]" style={{ color: '#D97706' }}>
                      <span className="font-medium">{progress.streak}-day streak</span>
                      {' '}— keep it going!
                    </div>
                  </div>
                )}
              </div>

              {/* Subject breakdown */}
              <div
                className="bg-white rounded-2xl p-5"
                style={{ border: '0.5px solid #e5e7eb' }}
              >
                <div className="text-[14px] font-medium text-gray-900 mb-4">
                  Questions by subject
                </div>
                <div className="flex flex-col gap-4">
                  {SUBJECT_NAMES.map(subject => {
                    const config = SUBJECTS[subject]
                    const count = progress.subjectCounts[subject] || 0
                    const pct = progress.totalQuestions > 0
                      ? Math.round((count / progress.totalQuestions) * 100)
                      : 0
                    return (
                      <div key={subject}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: config.color }}
                            />
                            <span className="text-[13px] text-gray-700">
                              {subject}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-gray-400">
                              {count} question{count !== 1 ? 's' : ''}
                            </span>
                            <span
                              className="text-[11px] font-medium w-9 text-right"
                              style={{ color: config.color }}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ backgroundColor: config.lightColor }}
                        >
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: config.color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Independence breakdown */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e5e7eb' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[14px] font-medium text-gray-900 mb-0.5">
                    Learning independence
                  </div>
                  <div className="text-[12px] text-gray-400">
                    How often you solved problems without needing a full explanation
                  </div>
                </div>
                <div
                  className="text-[13px] font-medium px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: `${independenceColor}15`,
                    color: independenceColor,
                  }}
                >
                  {independenceLabel}
                </div>
              </div>

              <div className="h-2 rounded-full bg-gray-100 mb-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${independenceScore}%`,
                    backgroundColor: independenceColor,
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-gray-400 mb-4">
                <span>Needs support</span>
                <span>Developing</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Avg hints per question',
                    value: avgHints,
                    note: 'Lower is more independent',
                    color: '#4338CA',
                  },
                  {
                    label: 'Total hints used',
                    value: totalHints,
                    note: 'Across all sessions',
                    color: '#D97706',
                  },
                  {
                    label: 'Independence score',
                    value: `${independenceScore}%`,
                    note: independenceLabel,
                    color: independenceColor,
                  },
                ].map(({ label, value, note, color }) => (
                  <div
                    key={label}
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#F8F7F4' }}
                  >
                    <div
                      className="text-[20px] font-medium leading-none mb-1"
                      style={{ color }}
                    >
                      {value}
                    </div>
                    <div className="text-[12px] text-gray-600 mb-0.5">
                      {label}
                    </div>
                    <div className="text-[11px] text-gray-400">{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e5e7eb' }}
            >
              <div className="text-[14px] font-medium text-gray-900 mb-4">
                Recent activity
              </div>

              {progress.recentActivity.length === 0 ? (
                <div className="text-[13px] text-gray-400 py-4 text-center">
                  No activity recorded yet
                </div>
              ) : (
                <div>
                  <div
                    className="grid text-[11px] font-medium uppercase tracking-widest text-gray-400 pb-2 mb-1"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      borderBottom: '0.5px solid #f3f4f6',
                    }}
                  >
                    <span>Question / Topic</span>
                    <span>Subject</span>
                    <span>Hints used</span>
                    <span>When</span>
                  </div>

                  {progress.recentActivity.slice(0, 10).map((item, i) => {
                    const config = SUBJECTS[item.subject] || SUBJECTS.Mathematics
                    return (
                      <div
                        key={i}
                        className="grid items-center py-2.5 text-[13px]"
                        style={{
                          gridTemplateColumns: '2fr 1fr 1fr 1fr',
                          borderBottom:
                            i < Math.min(progress.recentActivity.length, 10) - 1
                              ? '0.5px solid #f9fafb'
                              : 'none',
                        }}
                      >
                        <div className="flex items-center gap-2 pr-4 min-w-0">
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="text-gray-700 truncate">
                            {item.topic}
                          </span>
                        </div>
                        <div>
                          <span
                            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: config.lightColor,
                              color: config.color,
                            }}
                          >
                            {item.subject}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          {item.hintsUsed || 0}
                        </div>
                        <div className="text-gray-400">
                          {formatTime(item.timestamp)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}