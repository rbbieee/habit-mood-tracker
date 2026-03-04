import { useState } from 'react'
import type { DailyEntry, FormState, HabitKey } from '../../types'
import { HABIT_LABELS, DEFAULT_HABITS } from '../../types'
import { INITIAL_FORM } from '../../hooks/useTrackerData'
import './DailyForm.css'

interface Props {
  onSubmit: (form: FormState) => void
  entries: DailyEntry[]
}

const MOOD_EMOJI: Record<number, string> = {
  1: '😞', 2: '😟', 3: '😕', 4: '😐', 5: '😶',
  6: '🙂', 7: '😊', 8: '😄', 9: '🤩', 10: '🥳',
}

export const DailyForm = ({ onSubmit, entries }: Props) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const alreadyLoggedToday = entries.some(e => e.date === today)

  const handleMoodChange = (val: number) => {
    setForm(prev => ({ ...prev, mood: val }))
  }

  const handleHabitToggle = (habit: HabitKey) => {
    setForm(prev => ({
      ...prev,
      habits: { ...prev.habits, [habit]: !prev.habits[habit] },
    }))
  }

  const handleSubmit = () => {
    onSubmit(form)
    setForm({ mood: 5, habits: { ...DEFAULT_HABITS }, note: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="daily-form">
      <h2 className="form-title">
        How are you doing today?
        <span className="form-date">{today}</span>
      </h2>

      {alreadyLoggedToday && (
        <div className="alert alert-info">
          You've already logged today. Submitting again will overwrite it
        </div>
      )}

      {submitted && (
        <div className="alert alert-success">
          Entry saved successfully!
        </div>
      )}

      {/* Mood Slider */}
      <section className="form-section">
        <label className="section-label">
          Mood Level
          <span className="mood-display">
            {MOOD_EMOJI[form.mood]} {form.mood}/10
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={form.mood}
          onChange={e => handleMoodChange(Number(e.target.value))}
          className="mood-slider"
        />
        <div className="slider-ticks">
          <span>Low</span>
          <span>High</span>
        </div>
      </section>

      {/* Habit Checklist */}
      <section className="form-section">
        <label className="section-label">Today's Habits</label>
        <div className="habit-grid">
          {(Object.keys(HABIT_LABELS) as HabitKey[]).map(habit => (
            <button
              key={habit}
              className={`habit-btn ${form.habits[habit] ? 'active' : ''}`}
              onClick={() => handleHabitToggle(habit)}
              type="button"
            >
              <span className="habit-check">{form.habits[habit] ? '✓' : '○'}</span>
              {HABIT_LABELS[habit]}
            </button>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="form-section">
        <label className="section-label">Note (optional)</label>
        <textarea
          className="note-input"
          placeholder="Anything notable about today?"
          value={form.note}
          onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
          rows={3}
        />
      </section>

      <button className="submit-btn" onClick={handleSubmit}>
        Save Today's Entry
      </button>
    </div>
  )
}