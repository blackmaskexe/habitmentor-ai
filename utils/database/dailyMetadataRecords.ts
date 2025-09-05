import {
  getAppStartDate,
  getDate,
  getDatesLastWeek,
  getDatesThisWeek,
  getFormattedDate,
  isAppStartWeek,
} from "../date";
import {
  getAllHabitsCompletionRateOnDate,
  getHabitObjectFromId,
  getMissedHabitIdsOnDate,
} from "../habits";
import mmkvStorage from "../mmkvStorage";
import { DailyRecordEntry, DailyRecords } from "../types";

export function setMoodToday(moodLevel: number) {
  const MAX_MOOD_LEVEL = 4;

  const existingDailyRecords: DailyRecords = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  if (!existingDailyRecords) {
    // incase this doesn't exist on the user
    mmkvStorage.set("dailyRecords", JSON.stringify([]));
  }

  // checking for an entry for today:

  // if it doesn't find any entries for today, it creates a placeholder object there:
  if (!existingDailyRecords[getFormattedDate()]) {
    existingDailyRecords[getFormattedDate()] = {};
  }

  const todayRecord: DailyRecordEntry = {
    ...existingDailyRecords[getFormattedDate()],
  };
  // check to make sure there isn't already a mood rating for today:
  if (!todayRecord.moodRating) {
    todayRecord.moodRating = moodLevel / MAX_MOOD_LEVEL;
  }

  // setting the todayRecord in the existingDailyRecords:
  existingDailyRecords[getFormattedDate()] = todayRecord;

  // and putting this record back into the mmkvStorage:
  mmkvStorage.set("dailyRecords", JSON.stringify(existingDailyRecords));
}

export function didGetMoodCheckedToday() {
  return false;
  const existingDailyRecords: DailyRecords = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  if (!existingDailyRecords) {
    // not in mmkvstorage, therefore mood not checked
    return false;
  }

  const todayRecord: DailyRecordEntry = {
    ...existingDailyRecords[getFormattedDate()],
  };
  // if there is a moodRating already in there, that means the user got it checked so give false
  if (todayRecord && todayRecord.moodRating) {
    return true;
  } else {
    // in all other scenarios return false
    return false;
  }
}

export function addMissedHabitsThisWeekToMetadata() {
  const existingDailyRecords: DailyRecords = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  const datesSoFar = getDatesThisWeek();
  datesSoFar.length = getDate().getDay() + 1; // limiting the dates to just today

  // remove empty entries that will be caused when the user didn't download the app in the same week before appStartDate
  if (isAppStartWeek()) {
    // we will trim out the days before the user started the app:
    const startDate = getAppStartDate();
    datesSoFar.splice(0, startDate.getDay());
  }

  for (const date of datesSoFar) {
    console.log("apun run kar raha hu taipshi taipshi");
    const dateRecord: DailyRecordEntry = {
      ...existingDailyRecords[getFormattedDate(date)],
    };

    const missedHabits = getMissedHabitIdsOnDate(date).map((habitId) => {
      return getHabitObjectFromId(habitId)!.habitName;
    });
    dateRecord.missedHabits = missedHabits;
    existingDailyRecords[getFormattedDate(date)] = dateRecord;
  }

  mmkvStorage.set("dailyRecords", JSON.stringify(existingDailyRecords));
}

export function addMissedHabitsLastWeekToMetadata() {
  const existingDailyRecords: DailyRecords = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  const datesLastWeek = getDatesLastWeek();

  for (const date of datesLastWeek) {
    const dateRecord: DailyRecordEntry = {
      ...existingDailyRecords[getFormattedDate(date)],
    };

    const missedHabits = getMissedHabitIdsOnDate(date).map((habitId) => {
      return getHabitObjectFromId(habitId)!.habitName;
    });
    dateRecord.missedHabits = missedHabits;
    existingDailyRecords[getFormattedDate(date)] = dateRecord;
  }

  mmkvStorage.set("dailyRecords", JSON.stringify(existingDailyRecords));
}

export function addHabitsCompletionRateThisWeekToMetadata() {
  const existingDailyRecords: DailyRecords = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  const datesSoFar = getDatesThisWeek();
  datesSoFar.length = getDate().getDay() + 1; // limiting the dates to just today

  // remove empty entries that will be caused when the user didn't download the app in the same week before appStartDate
  if (isAppStartWeek()) {
    // we will trim out the days before the user started the app:
    const startDate = getAppStartDate();
    datesSoFar.splice(0, startDate.getDay());
  }

  for (const date of datesSoFar) {
    const dateRecord: DailyRecordEntry = {
      ...existingDailyRecords[getFormattedDate(date)],
    };

    const completionRate = getAllHabitsCompletionRateOnDate(date);
    dateRecord.habitCompletionRate = completionRate;
    existingDailyRecords[getFormattedDate(date)] = dateRecord;
  }

  mmkvStorage.set("dailyRecords", JSON.stringify(existingDailyRecords));
}

export function addHabitsCompletionRateLastWeekToMetadata() {
  const existingDailyRecords: DailyRecords = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  const datesLastWeek = getDatesLastWeek();

  for (const date of datesLastWeek) {
    const dateRecord: DailyRecordEntry = {
      ...existingDailyRecords[getFormattedDate(date)],
    };

    const completionRate = getAllHabitsCompletionRateOnDate(date);
    dateRecord.habitCompletionRate = completionRate;
    existingDailyRecords[getFormattedDate(date)] = dateRecord;
  }

  mmkvStorage.set("dailyRecords", JSON.stringify(existingDailyRecords));
}

export function getMetadataRecords(numDays: number) {
  // fetches the metadata records for the last n days
  // n DOES include today
  const entireMetadataRecord = JSON.parse(
    mmkvStorage.getString("dailyRecords") || "{}"
  );

  const fetchedMetadata: DailyRecords = {};

  const today = getDate();
  // looping backwards in the date, and adding the required metadata to the new
  // fetchedMetadata object
  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const recordInMetadataForDate =
      entireMetadataRecord[getFormattedDate(date)];

    if (recordInMetadataForDate) {
      fetchedMetadata[getFormattedDate(date)] = recordInMetadataForDate;
    }
  }

  return fetchedMetadata;
}
