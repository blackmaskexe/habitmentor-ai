// this is mainly to mark and unmark as incomplete, and to remember that

import { getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage"; // Import the existing MMKV instance

// Define an interface for the structure of a habit history entry
interface HabitHistoryEntry {
  id: number; // We'll use a timestamp for simplicity
  habitId: string;
  completionDate: string; // Expected format: YYYY-MM-DD
}

const HABIT_HISTORY_KEY = "habitHistory";
// this key

// Helper function to get all habit history entries from MMKV
function getHabitHistoryEntries(): HabitHistoryEntry[] {
  const storedEntries = mmkvStorage.getString(HABIT_HISTORY_KEY);
  if (storedEntries) {
    try {
      return JSON.parse(storedEntries) as HabitHistoryEntry[];
    } catch (e) {
      console.error("Error parsing habit history from MMKV:", e);
      return []; // Return empty array on parsing error
    }
  }
  return []; // Return empty array if no entries are found
}

// Helper function to save habit history entries to MMKV
function saveHabitHistoryEntries(entries: HabitHistoryEntry[]): void {
  mmkvStorage.set(HABIT_HISTORY_KEY, JSON.stringify(entries));
}

// Log all items from habitHistory table upon module load (initialization)
(() => {
  const initialEntries = getHabitHistoryEntries();
  console.log(
    "MMKV Storage: Current items in habitHistory upon module load:",
    initialEntries
  );
})();

// Marks a habit as complete for a given date.
export function onMarkAsComplete(habitId: string): {
  success: boolean;
  message?: string;
  entry?: HabitHistoryEntry;
} {
  const entries = getHabitHistoryEntries();
  const alreadyExists = entries.some(
    (entry) =>
      entry.habitId === habitId && entry.completionDate === getFormattedDate()
  );

  if (alreadyExists) {
    console.warn("MMKV Storage: Habit already marked complete for this date.");
    return { success: false, message: "Already marked complete" };
  }

  const newEntry: HabitHistoryEntry = {
    id: Date.now(), // Using timestamp as a simple ID
    habitId: habitId,
    completionDate: getFormattedDate(),
  };

  entries.push(newEntry);
  saveHabitHistoryEntries(entries);
  console.log("MMKV Storage: Habit marked complete:", newEntry);
  return { success: true, entry: newEntry };
}

// Marks a habit as incomplete for a given date by deleting the record.
export function onMarkAsIncomplete(habitId: string): { changes: number } {
  const entries = getHabitHistoryEntries();
  const initialLength = entries.length;
  const updatedEntries = entries.filter(
    (entry) =>
      !(
        entry.habitId === habitId && entry.completionDate === getFormattedDate()
      )
  );

  const changes = initialLength - updatedEntries.length;
  if (changes > 0) {
    saveHabitHistoryEntries(updatedEntries);
  }
  console.log("MMKV Storage: Habit marked incomplete, changes:", changes);
  return { changes };
}

// Retrieves all records from the habitHistory for today's date.
export function getAllHabitHistoryToday(): HabitHistoryEntry[] {
  const entries = getHabitHistoryEntries();

  const todayEntries = entries.filter(
    (entry) => entry.completionDate === getFormattedDate()
  );
  console.log(
    `MMKV Storage: Fetched habit history for today (${getFormattedDate()}).`,
    todayEntries
  );
  return todayEntries;
}

// Retrieves all records from the habitHistory.
export function getAllHabitHistory(): HabitHistoryEntry[] {
  const entries = getHabitHistoryEntries();
  console.log("MMKV Storage: Fetched all habit history.", entries);
  return entries;
}

// Retrieves habit history records for a specific habitId.
export function getHistoryForHabit(habitId: string): HabitHistoryEntry[] {
  const entries = getHabitHistoryEntries();
  const habitEntries = entries.filter((entry) => entry.habitId === habitId);
  console.log(
    `MMKV Storage: Fetched history for habit ${habitId}.`,
    habitEntries
  );
  return habitEntries;
}
