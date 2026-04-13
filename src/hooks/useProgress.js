import { useState, useEffect } from "react";
import { SUBJECT_NAMES } from "../utils/subjects";

const STORAGE_KEY = "studybuddy_progress";

const makeDefault = () => ({
  totalQuestions: 0,
  streak: 0,
  lastStudyDate: null,
  conceptsMastered: 0,
  subjectCounts: Object.fromEntries(SUBJECT_NAMES.map((s) => [s, 0])),
  recentActivity: [],
});

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return makeDefault();
    return { ...makeDefault(), ...JSON.parse(saved) };
  } catch {
    return makeDefault();
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Could not save progress to localStorage");
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(progress);
  }, [progress]);

  function logQuestion(subject, topic = null) {
    const today = new Date().toDateString();
    setProgress((prev) => {
      const isNewDay = prev.lastStudyDate !== today;
      const next = {
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
      saveToStorage(next);
      return next;
    });
  }

  function incrementHints(subject) {
    setProgress((prev) => {
      const activity = [...prev.recentActivity];
      const idx = activity.findIndex((a) => a.subject === subject);
      if (idx === -1) return prev;
      activity[idx] = {
        ...activity[idx],
        hintsUsed: (activity[idx].hintsUsed || 0) + 1,
      };
      const next = { ...prev, recentActivity: activity };
      saveToStorage(next);
      return next;
    });
  }

  function markConceptMastered() {
    setProgress((prev) => {
      const next = { ...prev, conceptsMastered: prev.conceptsMastered + 1 };
      saveToStorage(next);
      return next;
    });
  }

  function resetProgress() {
    const fresh = makeDefault();
    localStorage.removeItem(STORAGE_KEY);
    setProgress(fresh);
  }

  function clearSubjectActivity(subject) {
    setProgress((prev) => {
      const next = {
        ...prev,
        recentActivity: prev.recentActivity.filter(
          (a) => a.subject !== subject
        ),
        subjectCounts: {
          ...prev.subjectCounts,
          [subject]: 0,
        },
      };
      saveToStorage(next);
      return next;
    });
  }

  return {
    progress,
    logQuestion,
    incrementHints,
    markConceptMastered,
    resetProgress,
    clearSubjectActivity,
  };
}
