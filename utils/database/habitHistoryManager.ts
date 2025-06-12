import { getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import database from "./watermelon";
import { Q } from "@nozbe/watermelondb";
import HabitCompletion from "./watermelon/model/HabitCompletion";
import { getAllHabits, getHabitObjectFromId } from "./habits";

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
export async function onMarkAsComplete(habitId: string, date: Date) {
  // MANAGING THE MMKV PART:
  const entries = getHabitHistoryEntries();
  const alreadyExists = entries.some(
    (entry) =>
      entry.habitId === habitId &&
      entry.completionDate === getFormattedDate(date)
  );

  if (alreadyExists) {
    console.warn("MMKV Storage: Habit already marked complete for this date.");
    return;
  }

  const newEntry: HabitHistoryEntry = {
    id: Date.now(), // Using timestamp as a simple ID
    habitId: habitId,
    completionDate: getFormattedDate(date),
  };

  entries.push(newEntry);
  saveHabitHistoryEntries(entries);

  // MANAGING THE DATA COLLECTION PART:
  // these are not date dependent
  const habitCompletion = await getOrCreateHabitCompletionRecord(habitId);
  await habitCompletion.incrementTimesCompleted();
}

// Marks a habit as incomplete for a given date by deleting the record.
export async function onMarkAsIncomplete(habitId: string, date: Date) {
  // MANAGING THE MMKV PART:
  const entries = getHabitHistoryEntries();
  const updatedEntries = entries.filter(
    (entry) =>
      !(
        entry.habitId === habitId &&
        entry.completionDate === getFormattedDate(date)
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

  if (existingRecord.length > 0) {
    // if there is a record with the asssociated habit_id
    return existingRecord[0];
  } else {
    const allRecords = await habitCompletionCollection.query().fetch();

    return await database.write(async () => {
      const newRecord = await habitCompletionCollection.create((record) => {
        record.habitId = habitId;
        record.habitName = getHabitObjectFromId(habitId)!.habitName;
        record.timesCompleted = 0;
        record.timesMissed = 0;
        record.prevDaysSinceLast = 0;
      });

      return newRecord;
    });
  }
}

export async function getAllHabitCompletionRecords() {
  const habitCompletionRecords = [];
  for (const habit of getAllHabits()) {
    const record = await getOrCreateHabitCompletionRecord(habit.id);
    habitCompletionRecords.push(record);
  }

  return habitCompletionRecords;
}

// Helper function to save habit history entries to MMKV
function saveHabitHistoryEntries(entries: HabitHistoryEntry[]): void {
  mmkvStorage.set(HABIT_HISTORY_KEY, JSON.stringify(entries));
}

// Helper function to get all habit history entries from MMKV
export function getHabitHistoryEntries(): HabitHistoryEntry[] {
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

export function getAllHabitHistoryOnDate(date: Date) {
  const entries = getHabitHistoryEntries();

  const entriesOnDate = entries.filter(
    (entry) => entry.completionDate === getFormattedDate(date)
  );
  console.log(
    `MMKV Storage: Fetched habit history for today (${getFormattedDate(
      date
    )}).`,
    date
  );
  return entriesOnDate;
}

// Retrieves all records from the habitHistory.
export function getAllHabitHistory(): HabitHistoryEntry[] {
  const entries = getHabitHistoryEntries();
  console.log("MMKV Storage: Fetched all habit history.", entries);
  return entries;
}
