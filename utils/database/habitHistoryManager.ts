import { getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import database from "./watermelon";
import { Q } from "@nozbe/watermelondb";
import HabitCompletion from "./watermelon/model/HabitCompletion";

// Define an interface for the structure of a habit history entry in the mmkvStorage
interface HabitHistoryEntry {
  id: number; // timestamp based id
  habitId: string;
  completionDate: string; // Expected format: YYYY-MM-DD
}

const HABIT_HISTORY_KEY = "habitHistory";
const habitCompletionCollection =
  database.get<HabitCompletion>("habit_completions");

// Marks a habit as complete for a given date.
export async function onMarkAsComplete(habitId: string) {
  // MANAGING THE MMKV PART:
  const entries = getHabitHistoryEntries();
  const alreadyExists = entries.some(
    (entry) =>
      entry.habitId === habitId && entry.completionDate === getFormattedDate()
  );

  if (alreadyExists) {
    console.warn("MMKV Storage: Habit already marked complete for this date.");
    return;
  }

  const newEntry: HabitHistoryEntry = {
    id: Date.now(), // Using timestamp as a simple ID
    habitId: habitId,
    completionDate: getFormattedDate(),
  };

  entries.push(newEntry);
  saveHabitHistoryEntries(entries);

  // MANAGING THE DATA COLLECTION PART:
  const habitCompletion = await getOrCreateHabitCompletionRecord(habitId);
  await habitCompletion.incrementTimesCompleted();
}

// Marks a habit as incomplete for a given date by deleting the record.
export async function onMarkAsIncomplete(habitId: string) {
  // MANAGING THE MMKV PART:
  const entries = getHabitHistoryEntries();
  const updatedEntries = entries.filter(
    (entry) =>
      !(
        entry.habitId === habitId && entry.completionDate === getFormattedDate()
      )
  );

  saveHabitHistoryEntries(updatedEntries);

  // MANAGING THE DATA COLLECTION PART:
  const habitCompletion = await getOrCreateHabitCompletionRecord(habitId);
  await habitCompletion.decrementTimesCompleted();
}

// ALL HELPER FUNCTIONS:

// Helper function to fetch or create data collection record for the associated habitId
export async function getOrCreateHabitCompletionRecord(habitId: string) {
  const existingRecord = await habitCompletionCollection
    .query(Q.where("habit_id", habitId))
    .fetch();

  console.log("THERE IS!!! tung tung harkat");

  if (existingRecord.length > 0) {
    console.log("back to back to back to you, yu yu ano a back");
    // if there is a record with the asssociated habit_id
    return existingRecord[0];
  } else {
    const allRecords = await habitCompletionCollection.query().fetch();
    console.log("have you seen the hunkunkun", allRecords);

    return await database.write(async () => {
      const newRecord = await habitCompletionCollection.create((record) => {
        record.habitId = habitId;
        record.timesCompleted = 0;
        record.timesMissed = 0;
        record.prevDaysSinceLast = 0;
      });

      console.log("damn lavelas gimme a run for my manni");

      return newRecord;
    });
  }
}

// Helper function to save habit history entries to MMKV
function saveHabitHistoryEntries(entries: HabitHistoryEntry[]): void {
  mmkvStorage.set(HABIT_HISTORY_KEY, JSON.stringify(entries));
}

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
