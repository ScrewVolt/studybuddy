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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function TeacherView() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  const totalHints = progress.recentActivity.reduce(
    (sum, a) => sum + (a.hintsUsed || 0),
    0
  )

  const avgHintsPerQuestion =
    progress.totalQuestions > 0
      ? (totalHints / progress.totalQuestions).toFixed(1)
      : 0

  const mostStudied = SUBJECT_NAMES.reduce((a, b) =>
    progress.subjectCounts[a] >= progress.subjectCounts[b] ? a : b
  )

  const needsAttention = SUBJECT_NAMES.filter(
    s => progress.subjectCounts[s] === 0
  )

  const stats = [
    {
      value: progress.totalQuestions,
      label: 'Total questions asked',
      sub: 'Across all subjects',
      color: '#4338CA',
      bg: '#EEF2FF',
    },
    {
      value: progress.conceptsMastered,
      label: 'Concepts mastered',
      sub: 'Student confirmed understanding',
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      value: progress.streak,
      label: 'Day streak',
      sub: 'Consecutive study days',
      color: '#D97706',
      bg: '#FFFBEB',
    },
    {
      value: avgHintsPerQuestion,
      label: 'Avg hints per question',
      sub: 'Lower = more independent',
      color: '#DB2777',
      bg: '#FDF2F8',
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F4' }}>

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
          <div
            className="w-px h-4"
            style={{ backgroundColor: '#e5e7eb' }}
          />
          <div>
            <div className="text-[15px] font-medium text-gray-900">
              Teacher View
            </div>
            <div className="text-[12px] text-gray-400">
              Read-only summary — Miguel Garza
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
          style={{
            backgroundColor: '#ECFDF5',
            color: '#059669',
            border: '0.5px solid #d1fae5',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Live data
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Empty state */}
        {progress.totalQuestions === 0 && (
          <div
            className="bg-white rounded-2xl p-10 text-center"
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
              No activity yet
            </div>
            <div className="text-[13px] text-gray-400">
              Student data will appear here once sessions begin.
            </div>
          </div>
        )}

        {progress.totalQuestions > 0 && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map(({ value, label, sub, color, bg }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl p-4"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  <div
                    className="text-[26px] font-medium leading-none mb-1"
                    style={{ color }}
                  >
                    {value}
                  </div>
                  <div className="text-[13px] font-medium text-gray-700 mb-0.5">
                    {label}
                  </div>
                  <div className="text-[11px] text-gray-400">{sub}</div>
                </div>
              ))}
            </div>

            {/* Subject breakdown + insight */}
            <div className="grid grid-cols-2 gap-4">

              {/* Subject breakdown */}
              <div
                className="bg-white rounded-2xl p-5"
                style={{ border: '0.5px solid #e5e7eb' }}
              >
                <div className="text-[14px] font-medium text-gray-900 mb-4">
                  Activity by subject
                </div>
                <div className="flex flex-col gap-3">
                  {SUBJECT_NAMES.map(subject => {
                    const config = SUBJECTS[subject]
                    const count = progress.subjectCounts[subject]
                    const pct =
                      progress.totalQuestions > 0
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
                              className="text-[11px] font-medium w-8 text-right"
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

              {/* Teacher insights */}
              <div className="flex flex-col gap-3">

                {/* Most studied */}
                <div
                  className="bg-white rounded-xl p-4"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                    Most studied subject
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: SUBJECTS[mostStudied].lightColor,
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: SUBJECTS[mostStudied].color }}
                      />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-gray-900">
                        {mostStudied}
                      </div>
                      <div className="text-[12px] text-gray-400">
                        {progress.subjectCounts[mostStudied]} questions asked
                      </div>
                    </div>
                  </div>
                </div>

                {/* Needs attention */}
                <div
                  className="bg-white rounded-xl p-4"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                    Not yet studied
                  </div>
                  {needsAttention.length === 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 4l2 2 3-3.5"
                            stroke="#059669"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-[13px] text-gray-500">
                        All subjects covered
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {needsAttention.map(s => (
                        <span
                          key={s}
                          className="text-[12px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: SUBJECTS[s].lightColor,
                            color: SUBJECTS[s].color,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Independence indicator */}
                <div
                  className="bg-white rounded-xl p-4"
                  style={{ border: '0.5px solid #e5e7eb' }}
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                    Learning independence
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <div className="text-[22px] font-medium text-gray-900 leading-none">
                      {avgHintsPerQuestion}
                    </div>
                    <div className="text-[12px] text-gray-400 mb-0.5">
                      avg hints / question
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 mb-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (avgHintsPerQuestion / 5) * 100,
                          100
                        )}%`,
                        backgroundColor:
                          avgHintsPerQuestion <= 1.5
                            ? '#059669'
                            : avgHintsPerQuestion <= 3
                              ? '#D97706'
                              : '#E53E3E',
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {avgHintsPerQuestion <= 1.5
                      ? 'Working independently — great sign'
                      : avgHintsPerQuestion <= 3
                        ? 'Some guidance needed — normal range'
                        : 'Needs more support in this area'}
                  </div>
                </div>

              </div>
            </div>

            {/* Recent activity feed */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e5e7eb' }}
            >
              <div className="text-[14px] font-medium text-gray-900 mb-4">
                Recent session activity
              </div>

              {progress.recentActivity.length === 0 ? (
                <div className="text-[13px] text-gray-400 py-4 text-center">
                  No activity recorded yet
                </div>
              ) : (
                <div>
                  {/* Table header */}
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
                    <span>Time</span>
                  </div>

                  {/* Table rows */}
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