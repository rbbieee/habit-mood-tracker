import type { DailyEntry, HabitKey, HabitStats } from '../types'

// ── Stats per habit ──────────────────────────────────────
export const getHabitStats = (entries: DailyEntry[]): HabitStats[] => {
  if (entries.length === 0) return []

  const habitKeys: HabitKey[] = ['exercise', 'coding', 'reading', 'sleep_8h']

  return habitKeys.map(habit => {
    const withHabit    = entries.filter(e => e.habits[habit])
    const withoutHabit = entries.filter(e => !e.habits[habit])

    const avgMoodWith = withHabit.length > 0
      ? withHabit.reduce((s, e) => s + e.mood, 0) / withHabit.length
      : 0

    const avgMoodWithout = withoutHabit.length > 0
      ? withoutHabit.reduce((s, e) => s + e.mood, 0) / withoutHabit.length
      : 0

    return {
      habit,
      frequency: withHabit.length,
      frequencyPercent: parseFloat(
        ((withHabit.length / entries.length) * 100).toFixed(1)
      ),
      avgMoodWith:    parseFloat(avgMoodWith.toFixed(1)),
      avgMoodWithout: parseFloat(avgMoodWithout.toFixed(1)),
      moodDelta:      parseFloat((avgMoodWith - avgMoodWithout).toFixed(1)),
    }
  })
}

// ── Best habit (highest moodDelta) ──────────────────────
export const getBestHabit = (entries: DailyEntry[]): HabitKey | null => {
  const stats = getHabitStats(entries)
  if (stats.length === 0) return null

  const best = stats.reduce((prev, curr) =>
    curr.moodDelta > prev.moodDelta ? curr : prev
  )

  return best.moodDelta > 0 ? best.habit : null
}