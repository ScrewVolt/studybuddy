import { useState } from 'react'
import { SUBJECTS } from '../utils/subjects'

const LEVEL_CONFIG = {
  NUDGE: { label: 'Nudge', pips: 1, color: '#D97706' },
  HINT: { label: 'Hint', pips: 2, color: '#4338CA' },
  EXPLAIN: { label: 'Full explanation', pips: 3, color: '#059669' },
  COMPLETE: { label: 'Complete', pips: 3, color: '#059669' },
}

export default function HintCard({ parsed, onAction, onReply }) {
  const [selfMastered, setSelfMastered] = useState(false)
  const [replyText, setReplyText] = useState('')
  const { level, message, question, subject } = parsed
  const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG.HINT
  const subjectConfig = SUBJECTS[subject] || SUBJECTS.Mathematics

  const isComplete = level === 'COMPLETE'
  const isMastered = selfMastered || isComplete

  function handleReplySubmit() {
    if (!replyText.trim()) return
    onReply(replyText.trim())
    setReplyText('')
  }

  if (isMastered) {
    return (
      <div
        className="max-w-[88%] rounded-2xl rounded-bl-sm overflow-hidden"
        style={{ border: '0.5px solid #d1fae5', backgroundColor: '#ECFDF5' }}
      >
        <div className="p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7l3.5 3.5 5.5-6"
                  stroke="#059669"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              className="text-[13px] font-medium"
              style={{ color: '#059669' }}
            >
              {isComplete ? 'Correct!' : 'Concept marked as mastered'}
            </div>
          </div>
          {isComplete && message && (
            <p className="text-[13px] text-gray-600 leading-relaxed pl-9">
              {message}
            </p>
          )}
          {!isComplete && (
            <p className="text-[12px] text-gray-400 pl-9">
              Ask your next question whenever you're ready.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="max-w-[88%] bg-white rounded-2xl rounded-bl-sm overflow-hidden"
      style={{ border: '0.5px solid #e5e7eb' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '0.5px solid #f3f4f6' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-5 h-1 rounded-full"
                style={{
                  backgroundColor:
                    i <= levelConfig.pips ? levelConfig.color : '#e5e7eb',
                }}
              />
            ))}
          </div>
          <span
            className="text-[11px] font-medium uppercase tracking-wider"
            style={{ color: levelConfig.color }}
          >
            {levelConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: subjectConfig.lightColor,
              color: subjectConfig.color,
            }}
          >
            {subject}
          </span>
          <span className="text-[11px] text-gray-300">
            Level {levelConfig.pips} of 3
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-2">
        <div
          className="text-[11px] font-medium mb-1.5"
          style={{ color: '#4338CA' }}
        >
          StudyBuddy
        </div>
        <p className="text-[13px] text-gray-700 leading-relaxed">{message}</p>

        {question && (
          <div className="mt-3">
            <div
              className="px-3 py-2.5 rounded-t-lg text-[13px] font-medium"
              style={{
                backgroundColor: subjectConfig.lightColor,
                color: subjectConfig.color,
              }}
            >
              {question}
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-b-lg"
              style={{
                backgroundColor: '#fafafa',
                borderLeft: `0.5px solid ${subjectConfig.color}22`,
                borderRight: `0.5px solid ${subjectConfig.color}22`,
                borderBottom: `0.5px solid ${subjectConfig.color}22`,
                borderTop: `0.5px dashed ${subjectConfig.color}44`,
              }}
            >
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e =>
                  e.key === 'Enter' && !e.shiftKey && handleReplySubmit()
                }
                placeholder="Type your answer here..."
                className="flex-1 bg-transparent text-[13px] text-gray-700 outline-none placeholder-gray-300"
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium transition-all disabled:opacity-30"
                style={{
                  backgroundColor: replyText.trim()
                    ? subjectConfig.lightColor
                    : 'transparent',
                  color: subjectConfig.color,
                }}
              >
                <span>Reply</span>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 5.5L10 1L7.5 5.5L10 10L1 5.5Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2">
        <button
          onClick={() => onAction('hint')}
          className="text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
          style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
        >
          Another hint →
        </button>
        <button
          onClick={() => onAction('explain')}
          className="text-[12px] px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
          style={{ borderColor: '#e5e7eb', color: '#D97706' }}
        >
          Walk me through it
        </button>
        <button
          onClick={() => {
            setSelfMastered(true)
            onAction('mastered')
          }}
          className="text-[12px] px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
          style={{ backgroundColor: '#ECFDF5', color: '#059669' }}
        >
          I got it! ✓
        </button>
      </div>
    </div>
  )
}