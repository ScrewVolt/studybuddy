import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import SubjectCard from '../components/SubjectCard'
import { useProgress } from '../hooks/useProgress'
import { SUBJECT_NAMES, SUBJECTS } from '../utils/subjects'

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { progress, resetProgress } = useProgress()

  const recentSubject = progress.recentActivity[0]?.subject || 'Mathematics'
  const recentTopic = progress.recentActivity[0]?.topic || 'Linear equations'
  const recentHints = progress.recentActivity[0]?.hintsUsed || 0
  const recentConfig = SUBJECTS[recentSubject]

  const hasActivity = progress.totalQuestions > 0

  const stats = [
    {
      value: progress.streak,
      label: 'Day streak',
      change: progress.streak > 0 ? 'Keep it going!' : 'Start your streak today',
      color: '#D97706',
    },
    {
      value: progress.totalQuestions,
      label: 'Questions answered',
      change: `Across all subjects`,
      color: '#4338CA',
    },
    {
      value: progress.conceptsMastered,
      label: 'Concepts mastered',
      change: 'Marked by StudyBuddy',
      color: '#059669',
    },
    {
      value: progress.totalQuestions > 0
        ? `${Math.round(progress.totalQuestions * 1.5)}m`
        : '0m',
      label: 'Study time',
      change: 'Estimated total',
      color: '#DB2777',
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F4' }}>
      <TopNav progress={progress} />

      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Hero row */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* Welcome banner */}
          <div
            className="flex-1 rounded-2xl p-6 relative overflow-hidden"
            style={{ backgroundColor: '#4338CA' }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 160, height: 160,
                right: -40, top: -40,
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 100, height: 100,
                right: 50, bottom: -40,
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            />
            <div className="text-[11px] font-medium uppercase tracking-widest mb-1.5"
              style={{ color: '#818CF8' }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', hour: 'numeric', minute: '2-digit'
              })}
            </div>
            <div className="text-[22px] font-medium text-white mb-2 leading-tight">
              Good{' '}
              {new Date().getHours() < 12
                ? 'morning'
                : new Date().getHours() < 17
                  ? 'afternoon'
                  : 'evening'}
              , Miguel!
            </div>
            <div className="text-[13px] leading-relaxed max-w-xs"
              style={{ color: 'rgba(255,255,255,0.65)' }}>
              {hasActivity
                ? `You've answered ${progress.totalQuestions} question${progress.totalQuestions !== 1 ? 's' : ''} so far. Ready to keep building?`
                : "Welcome to StudyBuddy! Ask any question and I'll guide you through it step by step."}
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="mt-5 inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-[13px] font-medium transition-opacity hover:opacity-90"
              style={{ color: '#4338CA' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#4338CA" strokeWidth="1.2" />
                <path d="M5.5 5L9 7L5.5 9V5Z" fill="#4338CA" />
              </svg>
              Start a new session
            </button>
          </div>

          {/* Continue card */}
          <div className="w-56 flex-shrink-0 bg-white rounded-2xl p-5 flex flex-col border border-gray-100">
            <div className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">
              {hasActivity ? 'Continue where you left off' : 'Your first session'}
            </div>

            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: recentConfig.lightColor }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  stroke={recentConfig.color} strokeWidth="1.5">
                  <path d="M3 8h10M8 3v10" />
                  <circle cx="8" cy="8" r="5.5" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-medium text-gray-900">
                  {recentSubject}
                </div>
                <div className="text-[11px] text-gray-400">
                  {recentTopic}
                </div>
              </div>
            </div>

            {hasActivity && (
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-gray-400">Last session</span>
                  <span className="text-[11px] text-gray-400">
                    {recentHints} hints used
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: '67%',
                      backgroundColor: recentConfig.color,
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/chat', { state: { subject: recentSubject } })}
              className="mt-auto w-full py-2 rounded-lg text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: recentConfig.lightColor,
                color: recentConfig.color,
              }}
            >
              {hasActivity ? 'Resume session →' : 'Get started →'}
            </button>
          </div>

        </div>

        {/* Subject cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-medium text-gray-900">
              Choose a subject
            </span>
            <span className="text-[12px] cursor-pointer"
              style={{ color: '#4338CA' }}>
              View all topics →
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUBJECT_NAMES.map(subject => (
              <SubjectCard
                key={subject}
                subject={subject}
                count={progress.subjectCounts[subject]}
                isActive={subject === recentSubject && hasActivity}
              />
            ))}
          </div>
        </div>
        {/* How it works explainer */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: '0.5px solid #e5e7eb' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[14px] font-medium text-gray-900 mb-0.5">
                How StudyBuddy works
              </div>
              <div className="text-[12px] text-gray-400">
                Built for real learning — not shortcuts
              </div>
            </div>
            <div
              className="text-[11px] px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
            >
              Different from ChatGPT
            </div>
          </div>

          {/* Three steps */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                step: '01',
                title: 'Ask any question',
                description:
                  'Type any question from any subject. StudyBuddy automatically detects what you\'re studying — no setup needed.',
                color: '#4338CA',
                bg: '#EEF2FF',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                    stroke="#4338CA" strokeWidth="1.5">
                    <path d="M4 6h12M4 10h8M4 14h10" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Get guided, not answered',
                description:
                  'Instead of giving the answer, StudyBuddy uses a hint ladder — nudges, hints, and explanations that help you think it through yourself.',
                color: '#D97706',
                bg: '#FFFBEB',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                    stroke="#D97706" strokeWidth="1.5">
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 7v4M10 13.5v.5" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Master the concept',
                description:
                  'When you get it right, StudyBuddy confirms it, marks the concept as mastered, and tracks your progress — so teachers can see real growth.',
                color: '#059669',
                bg: '#ECFDF5',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                    stroke="#059669" strokeWidth="1.5">
                    <path d="M4 10l4.5 4.5L16 6" />
                  </svg>
                ),
              },
            ].map(({ step, title, description, color, bg, icon }) => (
              <div
                key={step}
                className="rounded-xl p-4"
                style={{ backgroundColor: bg, border: `0.5px solid ${color}22` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'white' }}
                  >
                    {icon}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color }}
                  >
                    {step}
                  </span>
                </div>
                <div
                  className="text-[13px] font-medium mb-1.5"
                  style={{ color }}
                >
                  {title}
                </div>
                <div className="text-[12px] leading-relaxed"
                  style={{ color: `${color}99` }}>
                  {description}
                </div>
              </div>
            ))}
          </div>

          {/* Hint ladder visual */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#F8F7F4', border: '0.5px solid #e5e7eb' }}
          >
            <div className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">
              The hint ladder — StudyBuddy's core feature
            </div>
            <div className="flex items-stretch gap-3">
              {[
                {
                  level: 'Nudge',
                  pips: 1,
                  color: '#D97706',
                  bg: '#FFFBEB',
                  description: 'A gentle push in the right direction. Points toward the method without revealing anything.',
                },
                {
                  level: 'Hint',
                  pips: 2,
                  color: '#4338CA',
                  bg: '#EEF2FF',
                  description: 'More specific guidance. Breaks the problem into a smaller step and asks about just that.',
                },
                {
                  level: 'Explain',
                  pips: 3,
                  color: '#059669',
                  bg: '#ECFDF5',
                  description: 'A full walkthrough of the concept when the student is genuinely stuck after trying.',
                },
              ].map(({ level, pips, color, bg, description }, i) => (
                <div key={level} className="flex items-stretch gap-3 flex-1">
                  <div
                    className="flex-1 rounded-lg p-3"
                    style={{ backgroundColor: bg, border: `0.5px solid ${color}33` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(j => (
                          <div
                            key={j}
                            className="w-4 h-1 rounded-full"
                            style={{
                              backgroundColor: j <= pips ? color : '#e5e7eb',
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-[11px] font-medium uppercase tracking-wider"
                        style={{ color }}
                      >
                        {level}
                      </span>
                    </div>
                    <div
                      className="text-[12px] leading-relaxed"
                      style={{ color: `${color}99` }}
                    >
                      {description}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="flex items-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3 7h8M8 4l3 3-3 3"
                          stroke="#d1d5db"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom callout */}
            <div
              className="mt-3 px-4 py-2.5 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: 'white', border: '0.5px solid #e5e7eb' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#EEF2FF' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 2v4M6 8.5v.5"
                    stroke="#4338CA"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-[12px] text-gray-500 leading-relaxed">
                Students control how much help they receive. The goal is always
                independence — StudyBuddy steps back as soon as the student demonstrates
                understanding.
              </div>
            </div>
          </div>
        </div>
        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-medium text-gray-900">
                Your progress
              </span>
              <button
                onClick={resetProgress}
                className="text-[11px] text-gray-300 hover:text-red-400 transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map(({ value, label, change, color }) => (
                <div key={label}
                  className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="text-[24px] font-medium text-gray-900 leading-none mb-1">
                    {value}
                  </div>
                  <div className="text-[12px] text-gray-400 mb-1">{label}</div>
                  <div className="text-[11px]" style={{ color }}>
                    {change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-medium text-gray-900">
                Recent activity
              </span>
              <span className="text-[12px] cursor-pointer"
                style={{ color: '#4338CA' }}>
                See all →
              </span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              {progress.recentActivity.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-[13px] text-gray-400 mb-1">
                    No activity yet
                  </div>
                  <div className="text-[12px] text-gray-300">
                    Start a session to see your history here
                  </div>
                </div>
              ) : (
                progress.recentActivity.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2.5"
                    style={{
                      borderBottom: i < Math.min(progress.recentActivity.length, 5) - 1
                        ? '0.5px solid #f3f4f6'
                        : 'none',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: SUBJECTS[item.subject]?.color || '#4338CA' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-gray-900 truncate">
                        {item.topic}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {item.subject} · {item.hintsUsed} hint{item.hintsUsed !== 1 ? 's' : ''} used
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-300 flex-shrink-0">
                      {formatTime(item.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}