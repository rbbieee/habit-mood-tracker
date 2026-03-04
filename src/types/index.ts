// HABITS

// habit list
export type HabitKey = 'exercise' | 'coding' | 'reading' | 'sleep_8h'

// one entry habit checklist (true = done, false = not yet)
export type HabitRecord = Record<HabitKey, boolean>

// DAILY ENTRY
export interface DailyEntry {
  id: string              // unique ID, using timestamp: "2024-03-04"
  date: string            // format ISO: "2024-03-04"
  mood: number            // scale 1–10
  habits: HabitRecord     // { exercise: true, coding: false, ... }
  note: string            // opsional note, it can be empty ""
  createdAt: number       // Date.now() for sorting
}

// INSIGHT 

export type InsightType = 'positive' | 'negative' | 'neutral'

export interface Insight {
  id: string
  message: string         // "your mood is high when doing exercise"
  type: InsightType       // for card color (green/red/grey)
  habit?: HabitKey        // this insight about some habit (optional)
  confidence: number      // 0–1, corelation strength
}
// STATISTICS 

export interface WeeklyStats {
  weekLabel: string       // "Mar 1–7"
  averageMood: number     // mood weekly avg
  totalEntries: number    // day filled
}

export interface HabitStats {
  habit: HabitKey
  frequency: number       // day count
  frequencyPercent: number // percentage of total entry
  avgMoodWith: number     // avg mood when activity
  avgMoodWithout: number  // avg mood when not doing activiy
  moodDelta: number       // avgMoodWith - avgMoodWithout
}
// FORM STATE 

export interface FormState {
  mood: number
  habits: HabitRecord
  note: string
}

// CONSTANTS 

export const HABIT_LABELS: Record<HabitKey, string> = {
  exercise: 'Exercise',
  coding: 'Coding',
  reading: 'Reading',
  sleep_8h: 'Sleep 8 Hours',
}

export const DEFAULT_HABITS: HabitRecord = {
  exercise: false,
  coding: false,
  reading: false,
  sleep_8h: false,
}