import { getFormattedDate } from "../date";
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
