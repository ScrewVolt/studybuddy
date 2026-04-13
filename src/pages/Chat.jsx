import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import HintCard from '../components/HintCard'
import MessageBubble from '../components/MessageBubble'
import { useProgress } from '../hooks/useProgress'
import { askStudyBuddy, detectSubject } from '../utils/studyBuddyAI'
import { SUBJECTS, SUBJECT_NAMES } from '../utils/subjects'

export default function Chat() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialSubject = location.state?.subject || null

  const { progress, logQuestion, incrementHints, markConceptMastered } =
    useProgress()

  const SESSION_KEY = 'studybuddy_session'

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return parsed.messages || []
    } catch {
      return []
    }
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [currentSubject, setCurrentSubject] = useState(() => {
    if (initialSubject) return initialSubject
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (!saved) return null
      return JSON.parse(saved).subject || null
    } catch {
      return null
    }
  })

  const [sessionQuestions, setSessionQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (!saved) return 0
      return JSON.parse(saved).sessionQuestions || 0
    } catch {
      return 0
    }
  })

  const [questionActive, setQuestionActive] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (!saved) return false
      return JSON.parse(saved).questionActive || false
    } catch {
      return false
    }
  })

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Persist session to localStorage whenever anything changes
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        messages,
        subject: currentSubject,
        sessionQuestions,
        questionActive,
      }))
    } catch {
      console.warn('Could not save session')
    }
  }, [messages, currentSubject, sessionQuestions, questionActive])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(overrideText, forceReply = false) {
    const text = (overrideText !== undefined ? overrideText : input).trim()
    if (!text || loading) return

    const detected = detectSubject(text)
    const subject = currentSubject || detected
    if (!currentSubject) setCurrentSubject(detected)

    // A message is a reply if we're mid-question AND it's not a new question
    // forceReply overrides this for hint/explain button clicks
    const isReply = forceReply || questionActive

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // Only log and count brand new questions
    if (!isReply) {
      setSessionQuestions(prev => prev + 1)
      logQuestion(subject, text.slice(0, 60))
      setQuestionActive(true)
    } else {
      incrementHints(subject)
    }

    try {
      const apiHistory = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }))
      const parsed = await askStudyBuddy(apiHistory, subject, isReply)

      // If the AI says COMPLETE, close out the question
      if (parsed.level === 'COMPLETE') {
        setQuestionActive(false)
        markConceptMastered()
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: parsed.raw,
          parsed: { ...parsed, subject },
        },
      ])
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Something went wrong.',
          parsed: {
            level: 'HINT',
            message:
              'Something went wrong connecting to StudyBuddy. Check your API key and internet connection.',
            question: null,
            subject,
          },
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleHintAction(action) {
    if (action === 'mastered') {
      markConceptMastered()
      setQuestionActive(false)
      return
    }
    const prompts = {
      hint: 'Can you give me another hint?',
      explain: 'Can you walk me through this step by step?',
    }
    if (prompts[action]) {
      handleSend(prompts[action], true)
    }
  }

  const subjectConfig = SUBJECTS[currentSubject] || SUBJECTS.Mathematics

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ backgroundColor: '#F8F7F4' }}
    >
      {/* Sidebar */}
      <div
        className="w-56 flex-shrink-0 bg-white flex flex-col overflow-hidden"
        style={{ borderRight: '0.5px solid #e5e7eb' }}
      >
        <div
          className="p-4 flex items-center gap-2.5"
          style={{ borderBottom: '0.5px solid #f3f4f6' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#4338CA' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6.5" r="4" fill="white" opacity="0.9" />
              <rect x="6.5" y="9.5" width="3" height="1.2" rx="0.6"
                fill="white" opacity="0.6" />
              <rect x="7" y="11" width="2" height="1.2" rx="0.6"
                fill="white" opacity="0.4" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-gray-900">
              StudyBuddy
            </div>
            <div className="text-[11px] text-gray-400">AI learning companion</div>
          </div>
        </div>

        <div className="p-3 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-2 mb-2">
            Subjects
          </div>
          {SUBJECT_NAMES.map(subject => {
            const config = SUBJECTS[subject]
            const isActive = currentSubject === subject
            return (
              <button
                key={subject}
                onClick={() => {
                  setCurrentSubject(subject)
                  setQuestionActive(false)
                  setMessages([])
                  setSessionQuestions(0)
                  localStorage.removeItem(SESSION_KEY)
                }}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors mb-0.5"
                style={{
                  backgroundColor: isActive ? config.lightColor : 'transparent',
                  color: isActive ? config.color : '#6b7280',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className={`text-[13px] ${isActive ? 'font-medium' : ''}`}>
                  {subject}
                </span>
              </button>
            )
          })}
        </div>

        <div className="p-4" style={{ borderTop: '0.5px solid #f3f4f6' }}>
          <div className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-2">
            This session
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[12px] text-gray-500">Questions</span>
            <span className="text-[12px] font-medium text-gray-900">
              {sessionQuestions}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[12px] text-gray-500">Concepts mastered</span>
            <span className="text-[12px] font-medium" style={{ color: '#059669' }}>
              {progress.conceptsMastered}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[12px] text-gray-500">Status</span>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={
                questionActive
                  ? { backgroundColor: '#EEF2FF', color: '#4338CA' }
                  : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
              }
            >
              {questionActive ? 'In progress' : 'Ready'}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors text-left flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to dashboard
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="bg-white flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '0.5px solid #e5e7eb' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1 rounded-full text-[12px] font-medium"
              style={{
                backgroundColor: subjectConfig.lightColor,
                color: subjectConfig.color,
              }}
            >
              {currentSubject || 'Ask anything'}
            </div>
            <div className="text-[12px] text-gray-400">
              {questionActive
                ? 'Working through a problem...'
                : 'Ask anything — StudyBuddy will guide you'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[12px] text-gray-400">Active session</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#EEF2FF' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="11" r="7" fill="#4338CA" opacity="0.9" />
                  <rect x="11" y="17" width="6" height="2" rx="1"
                    fill="#4338CA" opacity="0.6" />
                  <rect x="12" y="20" width="4" height="2" rx="1"
                    fill="#4338CA" opacity="0.4" />
                </svg>
              </div>
              <div className="text-[15px] font-medium text-gray-700 mb-1.5">
                Ready to help you learn
              </div>
              <div className="text-[13px] text-gray-400 max-w-xs leading-relaxed">
                Ask any question about{' '}
                {currentSubject ? currentSubject.toLowerCase() : 'any subject'}.
                StudyBuddy will guide you — never just give you the answer.
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                <MessageBubble content={msg.content} />
              ) : (
                <div className="flex gap-2.5 items-end">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                    style={{ backgroundColor: '#4338CA' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="5" r="3" fill="white" opacity="0.9" />
                      <rect x="4.5" y="7.5" width="3" height="1" rx="0.5"
                        fill="white" opacity="0.6" />
                    </svg>
                  </div>
                  <HintCard
                    parsed={msg.parsed}
                    onAction={handleHintAction}
                    onReply={text => handleSend(text, true)}
                  />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-end">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#4338CA' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="5" r="3" fill="white" opacity="0.9" />
                  <rect x="4.5" y="7.5" width="3" height="1" rx="0.5"
                    fill="white" opacity="0.6" />
                </svg>
              </div>
              <div
                className="bg-white rounded-2xl rounded-bl-sm px-4 py-3"
                style={{ border: '0.5px solid #e5e7eb' }}
              >
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: '#818CF8',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="bg-white px-5 py-4 flex-shrink-0"
          style={{ borderTop: '0.5px solid #e5e7eb' }}
        >
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e =>
                e.key === 'Enter' && !e.shiftKey && handleSend()
              }
              placeholder={
                questionActive
                  ? 'Ask a follow-up or start a new question...'
                  : 'Ask a question about anything you\'re studying...'
              }
              className="flex-1 px-4 py-2.5 rounded-2xl text-[13px] text-gray-800 outline-none transition-colors"
              style={{
                backgroundColor: '#F8F7F4',
                border: '0.5px solid #e5e7eb',
              }}
              onFocus={e => (e.target.style.borderColor = '#818CF8')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40"
              style={{ backgroundColor: '#4338CA' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L14 2L10 8L14 14L2 8Z" fill="white" />
              </svg>
            </button>
          </div>
          <div className="text-[11px] text-gray-300 text-center mt-2">
            StudyBuddy guides you — not gives you the answer
          </div>
        </div>
      </div>
    </div>
  )
}