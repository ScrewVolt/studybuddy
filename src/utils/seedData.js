const PROGRESS_KEY = "studybuddy_progress";
const getSessionKey = (subject) => `studybuddy_session_${subject}`;

const seedProgress = {
  totalQuestions: 18,
  streak: 5,
  lastStudyDate: new Date().toDateString(),
  conceptsMastered: 6,
  subjectCounts: {
    Mathematics: 9,
    Science: 5,
    History: 2,
    English: 2,
  },
  recentActivity: [
    {
      subject: "Mathematics",
      topic: "How do I solve 2x + 5 = 19?",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      hintsUsed: 2,
    },
    {
      subject: "Mathematics",
      topic: "What is the slope-intercept form?",
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      hintsUsed: 1,
    },
    {
      subject: "Science",
      topic: "How does photosynthesis work?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      hintsUsed: 3,
    },
    {
      subject: "Mathematics",
      topic: "How do I factor x² + 5x + 6?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      hintsUsed: 2,
    },
    {
      subject: "Science",
      topic: "What is the difference between mitosis and meiosis?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
      hintsUsed: 4,
    },
    {
      subject: "English",
      topic: "How do I write a strong thesis statement?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      hintsUsed: 1,
    },
    {
      subject: "History",
      topic: "What caused World War I?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 51).toISOString(),
      hintsUsed: 2,
    },
    {
      subject: "Mathematics",
      topic: "How do I find the area of a triangle?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString(),
      hintsUsed: 1,
    },
    {
      subject: "Science",
      topic: "What is Newton's second law?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
      hintsUsed: 2,
    },
    {
      subject: "Mathematics",
      topic: "How do I solve systems of equations?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 98).toISOString(),
      hintsUsed: 3,
    },
  ],
};

const seedSessions = {
  Mathematics: {
    subject: "Mathematics",
    sessionQuestions: 3,
    questionActive: false,
    messages: [
      {
        id: `u-${Date.now() - 1000 * 60 * 35}`,
        role: "user",
        content: "How do I solve 2x + 5 = 19?",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 34}`,
        role: "assistant",
        content:
          "LEVEL: NUDGE\nMESSAGE: You're working with a linear equation — the goal is to get x all by itself on one side. Think about what's currently attached to x and what operations you might use to undo them.\nQUESTION: What do you think the first step should be to start isolating x?",
        parsed: {
          level: "NUDGE",
          message:
            "You're working with a linear equation — the goal is to get x all by itself on one side. Think about what's currently attached to x and what operations you might use to undo them.",
          question:
            "What do you think the first step should be to start isolating x?",
          subject: "Mathematics",
        },
      },
      {
        id: `u-${Date.now() - 1000 * 60 * 33}`,
        role: "user",
        content: "Subtract 5 from both sides?",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 32}`,
        role: "assistant",
        content:
          "LEVEL: HINT\nMESSAGE: Exactly right! Subtracting 5 from both sides gives you 2x = 14. You've isolated the x term — great thinking. Now you're one step away.\nQUESTION: If 2x = 14, what do you do next to find what x equals by itself?",
        parsed: {
          level: "HINT",
          message:
            "Exactly right! Subtracting 5 from both sides gives you 2x = 14. You've isolated the x term — great thinking. Now you're one step away.",
          question:
            "If 2x = 14, what do you do next to find what x equals by itself?",
          subject: "Mathematics",
        },
      },
      {
        id: `u-${Date.now() - 1000 * 60 * 31}`,
        role: "user",
        content: "Divide both sides by 2, so x = 7",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 30}`,
        role: "assistant",
        content:
          "LEVEL: COMPLETE\nMESSAGE: That's exactly right — x = 7! You solved it by using inverse operations: subtracting 5 first, then dividing by 2. That's the core strategy for any linear equation.",
        parsed: {
          level: "COMPLETE",
          message:
            "That's exactly right — x = 7! You solved it by using inverse operations: subtracting 5 first, then dividing by 2. That's the core strategy for any linear equation.",
          question: null,
          subject: "Mathematics",
        },
      },
      {
        id: `u-${Date.now() - 1000 * 60 * 18}`,
        role: "user",
        content: "Can you help me with slope-intercept form?",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 17}`,
        role: "assistant",
        content:
          "LEVEL: NUDGE\nMESSAGE: Slope-intercept form is one of the most useful ways to write a linear equation. It's written as y = mx + b, where each letter represents something specific about the line.\nQUESTION: What do you think m and b each represent in y = mx + b?",
        parsed: {
          level: "NUDGE",
          message:
            "Slope-intercept form is one of the most useful ways to write a linear equation. It's written as y = mx + b, where each letter represents something specific about the line.",
          question: "What do you think m and b each represent in y = mx + b?",
          subject: "Mathematics",
        },
      },
    ],
  },
  Science: {
    subject: "Science",
    sessionQuestions: 2,
    questionActive: false,
    messages: [
      {
        id: `u-${Date.now() - 1000 * 60 * 60 * 3}`,
        role: "user",
        content: "How does photosynthesis work?",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 60 * 3 + 30000}`,
        role: "assistant",
        content:
          "LEVEL: NUDGE\nMESSAGE: Photosynthesis is how plants make their own food using light. Think about what ingredients a plant would need to produce energy — you might have seen the equation before in class.\nQUESTION: What are the raw materials a plant takes in to carry out photosynthesis?",
        parsed: {
          level: "NUDGE",
          message:
            "Photosynthesis is how plants make their own food using light. Think about what ingredients a plant would need to produce energy — you might have seen the equation before in class.",
          question:
            "What are the raw materials a plant takes in to carry out photosynthesis?",
          subject: "Science",
        },
      },
      {
        id: `u-${Date.now() - 1000 * 60 * 60 * 3 + 60000}`,
        role: "user",
        content: "Carbon dioxide and water?",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 60 * 3 + 90000}`,
        role: "assistant",
        content:
          "LEVEL: HINT\nMESSAGE: Exactly — CO₂ and water are the two raw materials. The plant also needs one more key ingredient that comes from outside. Think about where plants live and what they're always exposed to.\nQUESTION: What does the plant absorb through its leaves to power the whole process?",
        parsed: {
          level: "HINT",
          message:
            "Exactly — CO₂ and water are the two raw materials. The plant also needs one more key ingredient that comes from outside. Think about where plants live and what they're always exposed to.",
          question:
            "What does the plant absorb through its leaves to power the whole process?",
          subject: "Science",
        },
      },
      {
        id: `u-${Date.now() - 1000 * 60 * 60 * 3 + 120000}`,
        role: "user",
        content: "Sunlight!",
      },
      {
        id: `a-${Date.now() - 1000 * 60 * 60 * 3 + 150000}`,
        role: "assistant",
        content:
          "LEVEL: COMPLETE\nMESSAGE: Exactly right! Sunlight, CO₂, and water are the three inputs. The plant converts them into glucose for energy and releases oxygen as a byproduct — that's the full photosynthesis equation.",
        parsed: {
          level: "COMPLETE",
          message:
            "Exactly right! Sunlight, CO₂, and water are the three inputs. The plant converts them into glucose for energy and releases oxygen as a byproduct — that's the full photosynthesis equation.",
          question: null,
          subject: "Science",
        },
      },
    ],
  },
};

export function seedDemoData() {
  // Never overwrite real data that already has sessions
  const existing = localStorage.getItem(PROGRESS_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed.totalQuestions > 0) return false;
    } catch {
      // corrupted data — safe to overwrite
    }
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seedProgress));

  Object.entries(seedSessions).forEach(([subject, session]) => {
    localStorage.setItem(getSessionKey(subject), JSON.stringify(session));
  });

  return true;
}

export function clearDemoData() {
  localStorage.removeItem(PROGRESS_KEY);
  Object.keys(seedSessions).forEach((subject) => {
    localStorage.removeItem(getSessionKey(subject));
  });
}
