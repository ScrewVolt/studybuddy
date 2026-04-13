import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const FEATURES = [
  {
    number: '01',
    title: 'Ask any question',
    description: 'Type any academic question into the chat — no need to select a subject first. StudyBuddy reads your question and automatically detects whether you\'re working on math, science, history, or English.',
    detail: 'Subject auto-detection means you can jump straight in without any setup. Ask "How do I factor x² + 5x + 6?" and StudyBuddy knows it\'s a math question before you finish typing.',
    color: '#4338CA',
    bg: '#EEF2FF',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#4338CA" strokeWidth="1.5">
        <path d="M4 8h20M4 14h14M4 20h17" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'The hint ladder',
    description: 'Instead of giving you the answer, StudyBuddy guides you through three levels of support — Nudge, Hint, and Full Explanation. You control how much help you get.',
    detail: 'A Nudge points you in the right direction without revealing anything. A Hint breaks the problem into one small step. A Full Explanation walks through the concept when you\'re genuinely stuck.',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D97706" strokeWidth="1.5">
        <path d="M14 4v20M7 11l7-7 7 7" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Inline replies',
    description: 'When StudyBuddy asks you a guiding question, a reply box appears right beneath it — so you answer in context, not in a separate chat box at the bottom.',
    detail: 'This makes the experience feel like a real tutoring session. Your answer sits directly below the question it responds to, and StudyBuddy continues from exactly where you left off.',
    color: '#059669',
    bg: '#ECFDF5',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#059669" strokeWidth="1.5">
        <path d="M4 8h12a8 8 0 010 16H4" />
        <path d="M8 20l-4 4V4l4 4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Progress tracking',
    description: 'Every session is saved automatically. Your dashboard shows your streak, concepts mastered, and a breakdown of which subjects you\'ve been working on.',
    detail: 'The independence score measures how often you\'re solving problems without needing a full explanation — a lower average hints-per-question means you\'re getting stronger.',
    color: '#DB2777',
    bg: '#FDF2F8',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#DB2777" strokeWidth="1.5">
        <path d="M4 22V14M10 22V8M16 22v-6M22 22V4" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Session memory',
    description: 'Navigate away and come back — your full conversation is exactly where you left it. Each subject has its own saved session so switching between Math and Science never loses your work.',
    detail: 'Use the Sessions page to see all your active conversations at a glance, resume any of them instantly, or start a fresh session on a subject when you\'re ready for something new.',
    color: '#4338CA',
    bg: '#EEF2FF',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#4338CA" strokeWidth="1.5">
        <circle cx="14" cy="14" r="10" />
        <path d="M14 8v6l4 4" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Teacher view',
    description: 'A dedicated read-only page shows a full summary of your activity — questions asked, hints used, subjects covered, and your learning independence score.',
    detail: 'Teachers can see exactly where you\'re spending time, which subjects need more support, and how independently you\'re working — all without needing to sit next to you.',
    color: '#059669',
    bg: '#ECFDF5',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#059669" strokeWidth="1.5">
        <circle cx="14" cy="10" r="5" />
        <path d="M4 24c0-5.5 4.5-10 10-10s10 4.5 10 10" />
      </svg>
    ),
  },
]

const TUTORIAL_STEPS = [
  {
    step: '1',
    title: 'Create your account',
    description: 'Click "Get started free" and create an account with your email and password. Your progress is tied to your account so it\'s always there when you log back in.',
    tip: 'Use your school email so your teacher can identify your progress reports easily.',
    color: '#4338CA',
  },
  {
    step: '2',
    title: 'Load demo data or start fresh',
    description: 'On your dashboard, you\'ll see a "Load demo data" button in the Your Progress section if you have no activity yet. This fills the app with example sessions so you can explore all the features before asking your first real question.',
    tip: 'Hit Reset anytime to clear demo data and start fresh with your own sessions.',
    color: '#D97706',
  },
  {
    step: '3',
    title: 'Pick a subject and ask a question',
    description: 'Click any subject card on the dashboard or hit Start a new session. In the chat, just type your question naturally — something you\'re stuck on from homework, a concept from class, or anything you want to understand better.',
    tip: 'Don\'t worry about phrasing it perfectly. "I don\'t get photosynthesis" works just as well as a formal question.',
    color: '#059669',
  },
  {
    step: '4',
    title: 'Work through the hint ladder',
    description: 'StudyBuddy will respond with a Nudge — a gentle pointer toward the right approach. Read it carefully and type your answer in the reply box beneath the guiding question. If you need more help, click "Another hint" to go deeper.',
    tip: 'Try to answer with the Nudge first before asking for more hints. The goal is to figure it out yourself — StudyBuddy is just the guardrails.',
    color: '#4338CA',
  },
  {
    step: '5',
    title: 'Mark concepts as mastered',
    description: 'When you get the answer right, StudyBuddy will say "Correct!" and close out the question. You can also click "I got it!" yourself at any point to mark a concept as mastered and move on to your next question.',
    tip: 'Your concepts mastered count shows up on your dashboard and teacher view — it\'s a much better measure of learning than just questions asked.',
    color: '#DB2777',
  },
  {
    step: '6',
    title: 'Check your progress',
    description: 'Visit the Progress page from the nav to see your 7-day activity chart, subject breakdown, and independence score. The Teacher View page shows the same data in a format designed for educators.',
    tip: 'Share your Teacher View URL with your teacher directly — it updates in real time as you study.',
    color: '#059669',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState(0)
  const [activeTutorial, setActiveTutorial] = useState(0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F4', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 bg-white px-6 py-3 flex items-center justify-between"
        style={{ borderBottom: '0.5px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="text-[13px] text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="text-[13px] font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#4338CA', color: 'white' }}
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 py-20 text-center"
        style={{ backgroundColor: '#4338CA' }}
      >
        <div
          className="absolute rounded-full"
          style={{ width: 400, height: 400, right: -100, top: -100, backgroundColor: 'rgba(255,255,255,0.04)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 300, height: 300, left: -80, bottom: -80, backgroundColor: 'rgba(255,255,255,0.03)' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Free for students · No credit card required
          </div>
          <h1 className="text-[42px] font-medium text-white leading-tight mb-4">
            The AI tutor that teaches
            <br />
            <span style={{ color: '#A5B4FC' }}>you to think, not copy</span>
          </h1>
          <p className="text-[16px] leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            StudyBuddy guides you through problems step by step using hints and questions — never just handing you the answer. Built for students who want to actually learn.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 rounded-xl text-[14px] font-medium bg-white transition-opacity hover:opacity-90"
              style={{ color: '#4338CA' }}
            >
              Get started free →
            </button>
            <button
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            >
              See how it works
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="bg-white px-6 py-4"
        style={{ borderBottom: '0.5px solid #e5e7eb' }}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-4">
          {[
            { value: '4', label: 'Subjects covered' },
            { value: '3', label: 'Hint levels' },
            { value: '100%', label: 'Guided learning' },
            { value: '0', label: 'Direct answers given' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-[22px] font-medium mb-0.5"
                style={{ color: '#4338CA' }}
              >
                {value}
              </div>
              <div className="text-[12px] text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem statement */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div
            className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
          >
            The problem
          </div>
          <h2 className="text-[28px] font-medium text-gray-900 mb-4 leading-tight">
            Most AI tools make students<br />worse at learning
          </h2>
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-xl mx-auto">
            When you ask ChatGPT a homework question, you get the answer. You copy it, submit it, and learn nothing. The next time a similar problem appears — on a test, in class — you're just as stuck as before.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#FEF2F2', border: '0.5px solid #FECACA' }}
          >
            <div
              className="text-[12px] font-medium uppercase tracking-widest mb-3"
              style={{ color: '#DC2626' }}
            >
              Other AI tools
            </div>
            {[
              'Give the answer immediately',
              'No explanation of reasoning',
              'Student copies without understanding',
              'Same struggle next time',
              'Teacher has no visibility',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 mb-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FECACA' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M2 2l4 4M6 2L2 6" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[13px]" style={{ color: '#991B1B' }}>{item}</span>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#ECFDF5', border: '0.5px solid #D1FAE5' }}
          >
            <div
              className="text-[12px] font-medium uppercase tracking-widest mb-3"
              style={{ color: '#059669' }}
            >
              StudyBuddy
            </div>
            {[
              'Guides with hints and questions',
              'Explains the reasoning behind each step',
              'Student arrives at the answer themselves',
              'Understanding actually sticks',
              'Teacher dashboard with full insights',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 mb-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D1FAE5' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3.5" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[13px]" style={{ color: '#065F46' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="how-it-works" className="px-6 py-16" style={{ backgroundColor: 'white', borderTop: '0.5px solid #e5e7eb', borderBottom: '0.5px solid #e5e7eb' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
            >
              Features
            </div>
            <h2 className="text-[28px] font-medium text-gray-900 mb-3">
              Everything you need to actually learn
            </h2>
            <p className="text-[14px] text-gray-400 max-w-md mx-auto">
              Every feature is designed around one goal — helping you understand, not just finish.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {FEATURES.map((feature, i) => (
              <button
                key={feature.number}
                onClick={() => setActiveFeature(i)}
                className="text-left p-4 rounded-xl transition-all"
                style={{
                  backgroundColor: activeFeature === i ? feature.bg : '#F8F7F4',
                  border: activeFeature === i ? `1.5px solid ${feature.color}33` : '0.5px solid #e5e7eb',
                }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: activeFeature === i ? 'white' : '#F3F4F6' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 28 28" fill="none"
                      stroke={activeFeature === i ? feature.color : '#9CA3AF'} strokeWidth="1.5">
                      {feature.icon.props.children}
                    </svg>
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: activeFeature === i ? feature.color : '#9CA3AF' }}
                  >
                    {feature.number}
                  </span>
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: activeFeature === i ? feature.color : '#374151' }}
                >
                  {feature.title}
                </div>
              </button>
            ))}
          </div>

          {/* Feature detail */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: FEATURES[activeFeature].bg,
              border: `0.5px solid ${FEATURES[activeFeature].color}22`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'white' }}
              >
                {FEATURES[activeFeature].icon}
              </div>
              <div className="flex-1">
                <div
                  className="text-[11px] font-medium uppercase tracking-widest mb-1"
                  style={{ color: FEATURES[activeFeature].color }}
                >
                  Feature {FEATURES[activeFeature].number}
                </div>
                <h3
                  className="text-[18px] font-medium mb-2"
                  style={{ color: FEATURES[activeFeature].color }}
                >
                  {FEATURES[activeFeature].title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed mb-3"
                  style={{ color: `${FEATURES[activeFeature].color}cc` }}
                >
                  {FEATURES[activeFeature].description}
                </p>
                <div
                  className="px-4 py-3 rounded-lg text-[13px] leading-relaxed"
                  style={{ backgroundColor: 'white', color: '#4B5563' }}
                >
                  {FEATURES[activeFeature].detail}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint ladder deep dive */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div
            className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}
          >
            The core feature
          </div>
          <h2 className="text-[28px] font-medium text-gray-900 mb-3">
            The hint ladder, explained
          </h2>
          <p className="text-[14px] text-gray-400 max-w-md mx-auto">
            Three levels of support. You control how much help you get. The goal is always to need less of it over time.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              level: 'NUDGE',
              pips: 1,
              color: '#D97706',
              bg: '#FFFBEB',
              border: '#FDE68A',
              title: 'Level 1 — Nudge',
              description: 'The first response to any question. A gentle pointer toward the right method without revealing anything about the answer. Think of it as your tutor saying "you\'re on the right track, think about..."',
              example: '"You\'re working with a linear equation. Think about what operations are attached to x and how you might undo them. What do you think the first step should be?"',
            },
            {
              level: 'HINT',
              pips: 2,
              color: '#4338CA',
              bg: '#EEF2FF',
              border: '#C7D2FE',
              title: 'Level 2 — Hint',
              description: 'Triggered when you\'ve attempted something or clicked "Another hint." More specific than a nudge — it breaks the problem into one concrete next step and asks about just that step.',
              example: '"Exactly right — subtracting 5 from both sides gives you 2x = 14. You\'ve isolated the x term. Now you\'re one step away. If 2x = 14, what do you do to find x by itself?"',
            },
            {
              level: 'EXPLAIN',
              pips: 3,
              color: '#059669',
              bg: '#ECFDF5',
              border: '#A7F3D0',
              title: 'Level 3 — Full explanation',
              description: 'Triggered by clicking "Walk me through it" after being stuck for a while. A complete, step-by-step breakdown of the concept. Used sparingly — this is the safety net, not the first resort.',
              example: '"Let\'s work through this together. Starting with 2x + 5 = 19: first subtract 5 from both sides to get 2x = 14. Then divide both sides by 2 to isolate x. That gives us x = 7. The key strategy is inverse operations — undo each operation in reverse order."',
            },
          ].map(({ level, pips, color, bg, border, title, description, example }) => (
            <div
              key={level}
              className="rounded-2xl overflow-hidden"
              style={{ border: `0.5px solid ${border}` }}
            >
              <div
                className="px-5 py-3 flex items-center gap-3"
                style={{ backgroundColor: bg, borderBottom: `0.5px solid ${border}` }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="w-5 h-1.5 rounded-full"
                      style={{ backgroundColor: i <= pips ? color : '#e5e7eb' }}
                    />
                  ))}
                </div>
                <span
                  className="text-[12px] font-medium uppercase tracking-widest"
                  style={{ color }}
                >
                  {level}
                </span>
                <span className="text-[13px] font-medium text-gray-700 ml-1">
                  {title}
                </span>
              </div>
              <div className="px-5 py-4 bg-white">
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                  {description}
                </p>
                <div
                  className="px-4 py-3 rounded-lg text-[13px] italic leading-relaxed"
                  style={{ backgroundColor: bg, color }}
                >
                  {example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step by step tutorial */}
      <div
        className="px-6 py-16"
        style={{ backgroundColor: 'white', borderTop: '0.5px solid #e5e7eb', borderBottom: '0.5px solid #e5e7eb' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: '#ECFDF5', color: '#059669' }}
            >
              Tutorial
            </div>
            <h2 className="text-[28px] font-medium text-gray-900 mb-3">
              Getting started, step by step
            </h2>
            <p className="text-[14px] text-gray-400 max-w-md mx-auto">
              From zero to your first mastered concept in under 5 minutes.
            </p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {TUTORIAL_STEPS.map((s, i) => (
              <button
                key={s.step}
                onClick={() => setActiveTutorial(i)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                style={
                  activeTutorial === i
                    ? { backgroundColor: s.color, color: 'white' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                Step {s.step}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ border: '0.5px solid #e5e7eb' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[16px] font-medium text-white"
                style={{ backgroundColor: TUTORIAL_STEPS[activeTutorial].color }}
              >
                {TUTORIAL_STEPS[activeTutorial].step}
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-medium text-gray-900 mb-2">
                  {TUTORIAL_STEPS[activeTutorial].title}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                  {TUTORIAL_STEPS[activeTutorial].description}
                </p>
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: '#F8F7F4' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="7" cy="7" r="5.5" stroke="#D97706" strokeWidth="1.2" />
                    <path d="M7 4.5v3M7 9.5v.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-[12px] text-gray-500 leading-relaxed">
                    <span className="font-medium text-gray-700">Tip: </span>
                    {TUTORIAL_STEPS[activeTutorial].tip}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '0.5px solid #f3f4f6' }}>
              <button
                onClick={() => setActiveTutorial(Math.max(0, activeTutorial - 1))}
                disabled={activeTutorial === 0}
                className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L5 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>
              <div className="flex gap-1.5">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: i === activeTutorial
                        ? TUTORIAL_STEPS[activeTutorial].color
                        : '#e5e7eb',
                    }}
                  />
                ))}
              </div>
              {activeTutorial < TUTORIAL_STEPS.length - 1 ? (
                <button
                  onClick={() => setActiveTutorial(Math.min(TUTORIAL_STEPS.length - 1, activeTutorial + 1))}
                  className="flex items-center gap-1.5 text-[12px] font-medium transition-colors"
                  style={{ color: TUTORIAL_STEPS[activeTutorial].color }}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L9 7L5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#4338CA', color: 'white' }}
                >
                  Get started →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pages guide */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div
            className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
          >
            Navigation guide
          </div>
          <h2 className="text-[28px] font-medium text-gray-900 mb-3">
            What every page does
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              path: '/dashboard',
              name: 'Dashboard',
              color: '#4338CA',
              bg: '#EEF2FF',
              description: 'Your home base. Shows your streak, recent activity, subject cards, and the how-it-works explainer. Click any subject card to jump straight into a chat session for that subject.',
            },
            {
              path: '/chat',
              name: 'Chat',
              color: '#D97706',
              bg: '#FFFBEB',
              description: 'The main tutoring interface. Ask questions, work through the hint ladder, reply inline to guiding questions, and mark concepts as mastered. Switch subjects from the left sidebar without losing your session.',
            },
            {
              path: '/sessions',
              name: 'My Sessions',
              color: '#059669',
              bg: '#ECFDF5',
              description: 'A list of all your active saved sessions across every subject. Shows how many questions you asked, hints used, and lets you resume any conversation exactly where you left it.',
            },
            {
              path: '/progress',
              name: 'Progress',
              color: '#DB2777',
              bg: '#FDF2F8',
              description: 'Your full learning stats — 7-day activity chart, subject breakdown, independence score, and full recent activity table. Great for seeing which areas need more attention.',
            },
            {
              path: '/teacher',
              name: 'Teacher View',
              color: '#4338CA',
              bg: '#EEF2FF',
              description: 'A read-only analytics page designed for educators. Shows question counts, subjects covered, hints used, independence score, and full session history. Share this URL with your teacher.',
            },
          ].map(({ path, name, color, bg, description }) => (
            <div
              key={path}
              className="bg-white rounded-xl p-4 flex items-start gap-4"
              style={{ border: '0.5px solid #e5e7eb' }}
            >
              <div
                className="px-2.5 py-1 rounded-md text-[12px] font-medium flex-shrink-0 mt-0.5"
                style={{ backgroundColor: bg, color }}
              >
                {path}
              </div>
              <div>
                <div className="text-[14px] font-medium text-gray-900 mb-1">{name}</div>
                <div className="text-[13px] text-gray-500 leading-relaxed">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="px-6 py-16 text-center"
        style={{ backgroundColor: '#4338CA' }}
      >
        <div className="max-w-lg mx-auto">
          <h2 className="text-[28px] font-medium text-white mb-3">
            Ready to start learning?
          </h2>
          <p className="text-[14px] mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Create a free account and ask your first question in under a minute. No credit card, no setup, no shortcuts.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3 rounded-xl text-[14px] font-medium bg-white transition-opacity hover:opacity-90"
            style={{ color: '#4338CA' }}
          >
            Get started free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="bg-white px-6 py-6 flex items-center justify-between"
        style={{ borderTop: '0.5px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: '#4338CA' }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6.5" r="4" fill="white" opacity="0.9" />
              <rect x="6.5" y="9.5" width="3" height="1.2" rx="0.6" fill="white" opacity="0.6" />
            </svg>
          </div>
          <span className="text-[13px] font-medium text-gray-600">StudyBuddy</span>
        </div>
        <div className="text-[12px] text-gray-400">
          Built for Alamogordo High School · MESA 2026
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-[12px] font-medium"
          style={{ color: '#4338CA' }}
        >
          Sign in →
        </button>
      </div>

    </div>
  )
}