import type { Insight, HabitStats, HabitKey } from '../../types'
import { HABIT_LABELS } from '../../types'

interface Props {
  insights: Insight[]
  habitStats: HabitStats[]
}

const TYPE_STYLE: Record<string, { bg: string; border: string; icon: string }> = {
  positive: { bg: '#f0fdf4', border: '#86efac', icon: '📈' },
  negative: { bg: '#fff7ed', border: '#fdba74', icon: '📉' },
  neutral:  { bg: '#f8fafc', border: '#cbd5e1', icon: '💡' },
}

const HABIT_ORDER: HabitKey[] = ['exercise', 'coding', 'reading', 'sleep_8h']

export const InsightPanel = ({ insights, habitStats }: Props) => {
  return (
    <div className="insight-panel">
      <h2 className="insight-title">Your Insights</h2>

      {/* Insight cards */}
      <div className="insight-list">
        {insights.map(insight => {
          const style = TYPE_STYLE[insight.type]
          return (
            <div
              key={insight.id}
              className="insight-card"
              style={{ background: style.bg, borderColor: style.border }}
            >
              <span className="insight-icon">{style.icon}</span>
              <div className="insight-body">
                <p className="insight-message">{insight.message}</p>
                <span className="insight-confidence">
                  Confidence: {Math.round(insight.confidence * 100)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Habit stats table */}
      {habitStats.length > 0 && (
        <div className="stats-section">
          <h3 className="stats-title">Habit vs Mood Breakdown</h3>
          <div className="stats-table">

            {/* Header */}
            <div className="stats-row stats-header">
              <span>Habit</span>
              <span>Freq</span>
              <span>Mood with</span>
              <span>Mood without</span>
              <span>Delta</span>
            </div>

            {/* Rows */}
            {HABIT_ORDER.map(habit => {
              const s = habitStats.find(h => h.habit === habit)
              if (!s) return null
              const deltaColor = s.moodDelta > 0
                ? '#15803d' : s.moodDelta < 0
                ? '#dc2626' : '#6b7280'

              return (
                <div key={habit} className="stats-row">
                  <span className="stats-habit">{HABIT_LABELS[habit]}</span>
                  <span>{s.frequencyPercent}%</span>
                  <span>{s.avgMoodWith || '—'}</span>
                  <span>{s.avgMoodWithout || '—'}</span>
                  <span style={{ color: deltaColor, fontWeight: 600 }}>
                    {s.moodDelta > 0 ? '+' : ''}{s.moodDelta}
                  </span>
                </div>
              )
            })}

          </div>
        </div>
      )}
    </div>
  )
}