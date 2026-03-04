import type { DailyEntry, Insight, HabitKey } from '../types'
import { getHabitStats } from './habitAnalyzer'
import { getRecentMoodTrend } from './moodCalculator'

const HABIT_NAMES: Record<HabitKey, string> = {
  exercise: 'exercise',
  coding: 'coding',
  reading: 'reading',
  sleep_8h: 'sleeping 8 hours',
}

export const generateInsights = (entries: DailyEntry[]): Insight[] => {
  if (entries.length < 5) return [{
    id: 'not-enough-data',
    message: 'Log at least 5 days to start seeing insights.',
    type: 'neutral',
    confidence: 1,
  }]

  const insights: Insight[] = []
  const stats = getHabitStats(entries)
  const trend = getRecentMoodTrend(entries)

  // ── 1. Habit vs mood correlation ──────────────────────
  for (const s of stats) {
    // Not enough data points for this habit
    if (s.frequency < 3 || entries.length - s.frequency < 3) continue

    const confidence = Math.min(Math.abs(s.moodDelta) / 3, 1)
    if (confidence < 0.2) continue  // Too weak, skip

    if (s.moodDelta >= 1) {
      insights.push({
        id: `positive-${s.habit}`,
        message: `Your mood tends to be higher on days you do ${HABIT_NAMES[s.habit]} (+${s.moodDelta} pts on average).`,
        type: 'positive',
        habit: s.habit,
        confidence,
      })
    } else if (s.moodDelta <= -1) {
      insights.push({
        id: `negative-${s.habit}`,
        message: `Skipping ${HABIT_NAMES[s.habit]} seems to correlate with lower mood (${s.moodDelta} pts on average).`,
        type: 'negative',
        habit: s.habit,
        confidence,
      })
    }
  }

  // ── 2. Recent trend ───────────────────────────────────
  if (trend === 'improving') {
    insights.push({
      id: 'trend-improving',
      message: 'Your mood has been trending upward over the last 7 days. Keep it up!',
      type: 'positive',
      confidence: 0.8,
    })
  } else if (trend === 'declining') {
    insights.push({
      id: 'trend-declining',
      message: 'Your mood has been declining lately. Try to focus on your core habits.',
      type: 'negative',
      confidence: 0.8,
    })
  }

  // ── 3. Low sleep warning ──────────────────────────────
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)

  const sleepMissed = recentEntries.filter(e => !e.habits.sleep_8h).length
  if (sleepMissed >= 4) {
    insights.push({
      id: 'low-sleep-warning',
      message: `You missed your sleep goal ${sleepMissed} out of the last 7 days. Poor sleep often drags mood down.`,
      type: 'negative',
      habit: 'sleep_8h',
      confidence: 0.9,
    })
  }

  // ── 4. Sort by confidence ─────────────────────────────
  return insights.sort((a, b) => b.confidence - a.confidence)
}