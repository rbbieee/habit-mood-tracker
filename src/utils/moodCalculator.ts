import type { DailyEntry, WeeklyStats } from '../types'

// ── Weekly average ───────────────────────────────────────
export const getWeeklyStats = (entries: DailyEntry[]): WeeklyStats[] => {
  if (entries.length === 0) return []

  // Sort oldest first
  const sorted = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const weeks: WeeklyStats[] = []
  let i = 0

  while (i < sorted.length) {
    const weekSlice = sorted.slice(i, i + 7)
    const total = weekSlice.reduce((sum, e) => sum + e.mood, 0)
    const avg = total / weekSlice.length

    const start = weekSlice[0].date                      // "2024-03-01"
    const end   = weekSlice[weekSlice.length - 1].date   // "2024-03-07"

    weeks.push({
      weekLabel: formatWeekLabel(start, end),
      averageMood: parseFloat(avg.toFixed(1)),
      totalEntries: weekSlice.length,
    })

    i += 7
  }

  return weeks
}

// ── Overall average ──────────────────────────────────────
export const getOverallAvgMood = (entries: DailyEntry[]): number => {
  if (entries.length === 0) return 0
  const total = entries.reduce((sum, e) => sum + e.mood, 0)
  return parseFloat((total / entries.length).toFixed(1))
}

// ── Mood trend (last N days) ─────────────────────────────
export const getRecentMoodTrend = (
  entries: DailyEntry[],
  days: number = 7
): 'improving' | 'declining' | 'stable' => {
  const sorted = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-days)

  if (sorted.length < 3) return 'stable'

  const half = Math.floor(sorted.length / 2)
  const firstHalf  = sorted.slice(0, half)
  const secondHalf = sorted.slice(half)

  const avg = (arr: DailyEntry[]) =>
    arr.reduce((s, e) => s + e.mood, 0) / arr.length

  const delta = avg(secondHalf) - avg(firstHalf)

  if (delta >= 1)  return 'improving'
  if (delta <= -1) return 'declining'
  return 'stable'
}

// ── Helper ───────────────────────────────────────────────
const formatWeekLabel = (start: string, end: string): string => {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}