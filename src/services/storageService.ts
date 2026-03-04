import type { DailyEntry } from '../types'

const STORAGE_KEY = 'habit_mood_entries'

// ── Read ────────────────────────────────────────────────
export const getEntries = (): DailyEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DailyEntry[]
  } catch {
    console.error('Failed to read entries from localStorage')
    return []
  }
}

// ── Write ───────────────────────────────────────────────
export const saveEntry = (entry: DailyEntry): void => {
  try {
    const existing = getEntries()

    // Prevent duplicate: one entry per date
    const filtered = existing.filter(e => e.date !== entry.date)
    const updated = [...filtered, entry]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    console.error('Failed to save entry to localStorage')
  }
}

// ── Delete ──────────────────────────────────────────────
export const deleteEntry = (id: string): void => {
  try {
    const updated = getEntries().filter(e => e.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    console.error('Failed to delete entry from localStorage')
  }
}

// ── Seed (dev only) ─────────────────────────────────────
export const seedEntries = (entries: DailyEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

// ── Clear (dev/reset) ───────────────────────────────────
export const clearEntries = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}