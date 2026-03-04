import type { DailyEntry, HabitKey } from '../../types'
import { HABIT_LABELS } from '../../types'

interface Props {
  entries: DailyEntry[]
  onDelete: (id: string) => void
}

const MOOD_COLOR = (mood: number): string => {
  if (mood >= 8) return '#15803d'
  if (mood >= 6) return '#4f46e5'
  if (mood >= 4) return '#d97706'
  return '#dc2626'
}

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

export const HabitHistory = ({ entries, onDelete }: Props) => {
  if (entries.length === 0) {
    return (
      <div className="history-empty">
        <p>No entries yet.</p>
        <p>Start logging your day or load dummy data.</p>
      </div>
    )
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="habit-history">
      <h2 className="history-title">Entry History
        <span className="history-count">{entries.length} entries</span>
      </h2>

      <div className="history-list">
        {sorted.map(entry => (
          <div key={entry.id} className="history-card">

            {/* Top row: date + mood + delete */}
            <div className="hcard-header">
              <span className="hcard-date">{formatDate(entry.date)}</span>
              <div className="hcard-right">
                <span
                  className="hcard-mood"
                  style={{ color: MOOD_COLOR(entry.mood) }}
                >
                  {entry.mood}/10
                </span>
                <button
                  className="hcard-delete"
                  onClick={() => onDelete(entry.id)}
                  title="Delete entry"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Habit pills */}
            <div className="hcard-habits">
              {(Object.keys(HABIT_LABELS) as HabitKey[]).map(habit => (
                <span
                  key={habit}
                  className={`habit-pill ${entry.habits[habit] ? 'done' : 'skipped'}`}
                >
                  {entry.habits[habit] ? '✓' : '✗'} {HABIT_LABELS[habit]}
                </span>
              ))}
            </div>

            {/* Note */}
            {entry.note && (
              <p className="hcard-note">"{entry.note}"</p>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}