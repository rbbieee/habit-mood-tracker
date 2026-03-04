import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { DailyEntry, WeeklyStats } from '../../types'

interface Props {
  entries: DailyEntry[]
  weeklyStats: WeeklyStats[]
}

// Shape recharts expects
interface ChartPoint {
  date: string
  mood: number
  label: string
}

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const MoodChart = ({ entries, weeklyStats }: Props) => {
  if (entries.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data yet.</p>
        <p>Start logging or load dummy data to see your mood chart.</p>
      </div>
    )
  }

  // Sort oldest to newest, shape for recharts
  const chartData: ChartPoint[] = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(e => ({
      date: e.date,
      mood: e.mood,
      label: formatDate(e.date),
    }))

  const avgMood =
    parseFloat((entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1))

  return (
    <div className="mood-chart">
      <h2 className="chart-title">Mood Over Time</h2>

      {/* Daily line chart */}
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[1, 10]}
              ticks={[1, 3, 5, 7, 10]}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
              formatter={(val) => [`${val ?? '?'}/10`, 'Mood']}
              labelFormatter={label => `📅 ${label}`}
            />
            {/* Average reference line */}
            <ReferenceLine
              y={avgMood}
              stroke="#a5b4fc"
              strokeDasharray="4 4"
              label={{ value: `avg ${avgMood}`, fontSize: 11, fill: '#818cf8', position: 'right' }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly summary cards */}
      {weeklyStats.length > 0 && (
        <div className="weekly-section">
          <h3 className="weekly-title">Weekly Summary</h3>
          <div className="weekly-grid">
            {weeklyStats.map((w, i) => (
              <div key={i} className="weekly-card">
                <div className="weekly-label">{w.weekLabel}</div>
                <div className="weekly-avg">{w.averageMood}</div>
                <div className="weekly-sub">{w.totalEntries} days logged</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}