import { useState, useEffect, useCallback } from 'react'
import type { DailyEntry, FormState, Insight, HabitStats, WeeklyStats } from '../types'
import { DEFAULT_HABITS } from '../types'
import { getEntries, saveEntry, deleteEntry, seedEntries } from '../services/storageService'
import { getWeeklyStats, getOverallAvgMood } from '../utils/moodCalculator'
import { getHabitStats } from '../utils/habitAnalyzer'
import { generateInsights } from '../utils/insightGenerator'
import { dummyData } from '../data/dummyData'

// ── Types ────────────────────────────────────────────────

interface TrackerState {
  entries: DailyEntry[]
  insights: Insight[]
  habitStats: HabitStats[]
  weeklyStats: WeeklyStats[]
  overallAvgMood: number
}

interface TrackerActions {
  submitEntry: (form: FormState) => void
  removeEntry: (id: string) => void
  loadDummyData: () => void
  clearAllData: () => void
}

// ── Initial form state ───────────────────────────────────

export const INITIAL_FORM: FormState = {
  mood: 5,
  habits: { ...DEFAULT_HABITS },
  note: '',
}

// ── Hook ─────────────────────────────────────────────────

export const useTrackerData = (): TrackerState & TrackerActions => {
  const [entries, setEntries] = useState<DailyEntry[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getEntries()
    setEntries(stored)
  }, [])

  // Derived state: recomputed whenever entries change
  const insights    = generateInsights(entries)
  const habitStats  = getHabitStats(entries)
  const weeklyStats = getWeeklyStats(entries)
  const overallAvgMood = getOverallAvgMood(entries)

  // ── Actions ────────────────────────────────────────────

  const submitEntry = useCallback((form: FormState) => {
    const today = new Date().toISOString().split('T')[0]

    const newEntry: DailyEntry = {
      id: today,
      date: today,
      mood: form.mood,
      habits: { ...form.habits },
      note: form.note.trim(),
      createdAt: Date.now(),
    }

    saveEntry(newEntry)                          // persist
    setEntries(getEntries())                     // re-sync from storage
  }, [])

  const removeEntry = useCallback((id: string) => {
    deleteEntry(id)
    setEntries(getEntries())
  }, [])

  const loadDummyData = useCallback(() => {
    seedEntries(dummyData)
    setEntries(dummyData)
  }, [])

  const clearAllData = useCallback(() => {
    localStorage.clear()
    setEntries([])
  }, [])

  return {
    // state
    entries,
    insights,
    habitStats,
    weeklyStats,
    overallAvgMood,
    // actions
    submitEntry,
    removeEntry,
    loadDummyData,
    clearAllData,
  }
}