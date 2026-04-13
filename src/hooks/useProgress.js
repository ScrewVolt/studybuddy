import { useState, useEffect } from "react";
import { SUBJECT_NAMES } from "../utils/subjects";

const STORAGE_KEY = "studybuddy_progress";

const defaultProgress = {
  totalQuestions: 0,
  streak: 0,
  lastStudyDate: null,
  conceptsMastered: 0,
  totalMinutes: 0,
  subjectCounts: Object.fromEntries(SUBJECT_NAMES.map((s) => [s, 0])),
  recentActivity: [],
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...defaultProgress, ...JSON.parse(saved) }
        : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function logQuestion(subject, topic = null) {
    const today = new Date().toDateString();

    setProgress((prev) => {
      const isNewDay = prev.lastStudyDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

      const newActivity = {
        subject,
        topic: topic || subject,
        timestamp: new Date().toISOString(),
        hintsUsed: 0,
      };

      return {
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        streak: newStreak,
        lastStudyDate: today,
        subjectCounts: {
          ...prev.subjectCounts,
          [subject]: prev.subjectCounts[subject] + 1,
        },
        recentActivity: [newActivity, ...prev.recentActivity].slice(0, 20),
      };
    });
  }

  function incrementHints(subject) {
    setProgress((prev) => ({
      ...prev,
      recentActivity: prev.recentActivity.map((a, i) =>
        i === 0 && a.subject === subject
          ? { ...a, hintsUsed: a.hintsUsed + 1 }
          : a
      ),
    }));
  }

  function markConceptMastered() {
    setProgress((prev) => ({
      ...prev,
      conceptsMastered: prev.conceptsMastered + 1,
    }));
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
  }

  return {
    progress,
    logQuestion,
    incrementHints,
    markConceptMastered,
    resetProgress,
  };
}
