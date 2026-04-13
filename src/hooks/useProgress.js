import { useState, useEffect } from "react";
import { SUBJECT_NAMES } from "../utils/subjects";

const STORAGE_KEY = "studybuddy_progress";

const makeDefault = () => ({
  totalQuestions: 0,
  streak: 0,
  lastStudyDate: null,
  conceptsMastered: 0,
  totalMinutes: 0,
  subjectCounts: Object.fromEntries(SUBJECT_NAMES.map((s) => [s, 0])),
  recentActivity: [],
});

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...makeDefault(), ...JSON.parse(saved) } : makeDefault();
    } catch {
      return makeDefault();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function logQuestion(subject, topic = null) {
    const today = new Date().toDateString();
    setProgress((prev) => {
      const isNewDay = prev.lastStudyDate !== today;
      return {
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        streak: isNewDay ? prev.streak + 1 : prev.streak,
        lastStudyDate: today,
        subjectCounts: {
          ...prev.subjectCounts,
          [subject]: (prev.subjectCounts[subject] || 0) + 1,
        },
        recentActivity: [
          {
            subject,
            topic: topic || subject,
            timestamp: new Date().toISOString(),
            hintsUsed: 0,
          },
          ...prev.recentActivity,
        ].slice(0, 20),
      };
    });
  }

  function incrementHints(subject) {
    setProgress((prev) => {
      const activity = [...prev.recentActivity];
      const idx = activity.findIndex((a) => a.subject === subject);
      if (idx === -1) return prev;
      activity[idx] = {
        ...activity[idx],
        hintsUsed: activity[idx].hintsUsed + 1,
      };
      return { ...prev, recentActivity: activity };
    });
  }

  function markConceptMastered() {
    setProgress((prev) => ({
      ...prev,
      conceptsMastered: prev.conceptsMastered + 1,
    }));
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(makeDefault());
  }

  return {
    progress,
    logQuestion,
    incrementHints,
    markConceptMastered,
    resetProgress,
  };
}
