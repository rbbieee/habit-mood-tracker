# Habit & Mood Tracker

A personal habit and mood tracking web app built with React + TypeScript.
Track your daily habits, visualize mood trends, and get automatic insights
based on your data.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)

---

## Features

- **Daily Log**: Rate your mood (1–10) and check off completed habits
- **Mood Chart**: Line chart with weekly averages and trend reference line
- **Entry History**: Scrollable history with color-coded mood scores
- **Auto Insights**: Correlation analysis between habits and mood (e.g. "Your mood is higher on days you exercise")

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + TypeScript |
| Build | Vite |
| Charts | Recharts |
| Storage | localStorage (no backend) |
| Styling | Plain CSS |

---

## Project Structure
```
src/
├── components/        # UI only, no business logic
│   ├── DailyForm/
│   ├── MoodChart/
│   ├── HabitHistory/
│   └── InsightPanel/
├── services/          # External communication (localStorage)
│   └── storageService.ts
├── utils/             # Pure functions framework agnostic
│   ├── moodCalculator.ts
│   ├── habitAnalyzer.ts
│   └── insightGenerator.ts
├── hooks/             # React state bridge
│   └── useTrackerData.ts
├── types/             # All interfaces and type definitions
│   └── index.ts
└── data/
    └── dummyData.ts   # Sample data for development
```

---

## Getting Started
```bash
# Clone the repository
git clone https://github.com/rbbieee/habit-mood-tracker.git
cd habit-mood-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Architecture

This project follows a **separation of concerns** principle:

- `utils/` pure TypeScript functions with no React dependency. Can be unit tested independently.
- `services/` handles all localStorage read/write. Swap to an API later by only changing this layer.
- `hooks/` bridge between business logic and React state. Components stay "dumb".
- `components/` responsible for rendering only. Receives data and callbacks via props.

---

## How Insights Work

The insight engine compares average mood on days a habit was done vs. not done:
```
moodDelta = avgMoodWith - avgMoodWithout
```

If `moodDelta >= 1` with enough data points, a positive insight is generated.
Insights are sorted by confidence score before display.

---

### Still in development...