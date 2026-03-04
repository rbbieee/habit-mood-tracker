import { useState } from 'react'
import { useTrackerData } from './hooks/useTrackerData'
import { DailyForm } from './components/DailyForm/DailyForm'
import { MoodChart } from './components/MoodChart/MoodChart'
import { HabitHistory } from './components/HabitHistory/HabitHistory'
import { InsightPanel } from './components/InsightPanel/InsightPanel'
import './App.css'

type Tab = 'log' | 'chart' | 'history' | 'insights'

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('log')
  const tracker = useTrackerData()

  const tabs: { key: Tab; label: string }[] = [
    { key: 'log',      label: 'Log'      },
    { key: 'chart',    label: 'Chart'    },
    { key: 'history',  label: 'History'  },
    { key: 'insights', label: 'Insights' },
  ]

  return (
    <div className="app">
      <header className="app-header">
        <h1>Habit & Mood Tracker</h1>
        <p className="app-subtitle">
          {tracker.entries.length} entries · Avg mood:{' '}
          <strong>{tracker.overallAvgMood || '—'}</strong>
        </p>
      </header>

      {/* Dev tools: remove before production */}
      <div className="dev-toolbar">
        <button onClick={tracker.loadDummyData}>Load Dummy Data</button>
        <button onClick={tracker.clearAllData}>Clear All</button>
      </div>

      <nav className="tab-nav">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {activeTab === 'log'      && <DailyForm     onSubmit={tracker.submitEntry} entries={tracker.entries} />}
        {activeTab === 'chart'    && <MoodChart      entries={tracker.entries} weeklyStats={tracker.weeklyStats} />}
        {activeTab === 'history'  && <HabitHistory   entries={tracker.entries} onDelete={tracker.removeEntry} />}
        {activeTab === 'insights' && <InsightPanel   insights={tracker.insights} habitStats={tracker.habitStats} />}
      </main>
    </div>
  )
}

export default App