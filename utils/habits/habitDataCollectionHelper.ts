import {
  getDate,
  getDateFromFormattedDate,
  getDatesThisWeek,
  getFormattedDate,
  getWeekdayNumber,
  getWeekNumber,
  isAppStartWeek,
} from "../date";
import {
  getAllHabitHistory,
  getAllHabitHistoryEntriesOnDate,
  getOrCreateHabitCompletionRecord,
} from "./habitHistoryManager";
import {
  getAllHabits,
  getHabitObjectFromId,
  getIdsOfHabitsDueOnWeekday,
} from ".";
import mmkvStorage from "../mmkvStorage";
import database from "../database/watermelon";
import ImportantMessage from "../database/watermelon/model/ImportantMessage";
import { Q } from "@nozbe/watermelondb";
import HabitCompletion from "../database/watermelon/model/HabitCompletion";
import {
  addHabitsCompletionRateLastWeekToMetadata,
  addHabitsCompletionRateThisWeekToMetadata,
  addMissedHabitsLastWeekToMetadata,
  addMissedHabitsThisWeekToMetadata,
} from "../database/dailyMetadataRecords";

export async function runHabitDataCollection() {
  // collects data for:
  // times habits missed
  // streak of the habit
  // days since the last habit was done
  // basically stuff for the habit_completions table for tigrelini watermelini db

  if (shouldCollectData()) {
    // STREAK COLLECITON, DAYS MISSED CALCULATION, ETC:
    console.log("we both know we can't go without it");
    for (const habit of getAllHabits()) {
      if (!shouldCollectDataForHabit(habit.id)) {
        return; // early return if the habit is not to be done today
        // this makes sure streak is not increased everyday for tasks
        // that are scheduled not everyday
      }
      // running data collection on each of them:
      const habitCompletion = await getOrCreateHabitCompletionRecord(habit.id); // this is the record of datacollection for that habit
      const daysMissedSinceLast = daysUserMissedHabitSinceLastCompletion(
        habit.id
      );
      if (daysMissedSinceLast > 0) {
        const prevDaysMissedSinceLast = await habitCompletion.prevDaysSinceLast;

        // finding the updated missed days to add to increment
        const actualMissedDays =
          daysMissedSinceLast - prevDaysMissedSinceLast > 0
            ? daysMissedSinceLast - prevDaysMissedSinceLast
            : daysMissedSinceLast;

        await habitCompletion.incrementTimesMissed(actualMissedDays);
        await habitCompletion.update((record) => {
          record.prevDaysSinceLast = daysMissedSinceLast; // update the function with the latest days since
        });
      }
    }

    // add names of habits missed in the past 2 weeks in the daily metadata records (not normal daily habit history record)
    addMissedHabitsThisWeekToMetadata();
    if (!isAppStartWeek()) {
      // only run this if it isn't the user's first week of using the app
      addMissedHabitsLastWeekToMetadata();
    }
    // as well as the habit completion information:
    addHabitsCompletionRateThisWeekToMetadata();
    if (!isAppStartWeek()) {
      addHabitsCompletionRateLastWeekToMetadata();
    }

    // finally, set the last date the data was collected to today
    mmkvStorage.set("lastDataCollectionDate", getFormattedDate());
  }
}

export async function addImportantMessage(importantMessage: string) {
  const importantMessagesCollection =
    database.get<ImportantMessage>("important_messages");

  return database.write(async () => {
    await importantMessagesCollection.create((record) => {
      record.importantMessage = importantMessage;
    });
  });
}

export async function getImportantMessages(limit?: number) {
  const importantMessagesCollection =
    database.get<ImportantMessage>("important_messages");

  const importantMessagesArray = [];
  let records: ImportantMessage[] | null = null;

  if (limit) {
    records = await importantMessagesCollection
      .query(Q.sortBy("created_at", Q.desc), Q.take(limit))
      .fetch();
  } else {
    records = await importantMessagesCollection.query().fetch();
  }

  for (const record of records) {
    importantMessagesArray.push(record.importantMessage);
  }

  return importantMessagesArray;
}

export async function getHabitCompletionCollection() {
  const habitCompletionCollection =
    database.get<HabitCompletion>("habit_completions");

  const habitCompletionsArray = [];
  const records: HabitCompletion[] = await habitCompletionCollection
    .query()
    .fetch();

  for (const record of records) {
    habitCompletionsArray.push({
      timesMissed: record.timesMissed,
      timesCompleted: record.timesCompleted,
      streak: record.streak,
      habitId: record.habitId,
      habitName: record.habitName,
    });
  }

  return habitCompletionsArray;
}

export function getMissedHabitIdsSoFarThisWeek(): string[][] {
  // this function will return an array of arrays containing habitId,
  // where the outer array will be at most of 7 length (today is saturday), and at minimum
  // of 1 length (today is sunday)
  const datesSoFarThisWeek = getDatesThisWeek();
  datesSoFarThisWeek.length = getDate().getDay() + 1; // addimg 1 because
  // "so far" also includes today's day

  const allHabits = getAllHabits();

  const idsOfHabitsMissedSoFar = [];

  const habitFrequencies: Record<string, boolean[]> = {}; // a map, with
  // keys being habitId, and value being frequency (boolean[])
  for (const habit of allHabits) {
    habitFrequencies[habit.id] = habit.frequency;
  }

  for (const date of datesSoFarThisWeek) {
    // getting all habits due on this day, but leaving only those which
    // weren't done:
    let idsOfHabitsMissedOnDate = getIdsOfHabitsDueOnWeekday(date);
    const entriesOnDate = getAllHabitHistoryEntriesOnDate(date);

    for (const entry of entriesOnDate) {
      // keep removing elements from idsOfHabitsToBeDoneOnDate when find it
      // in an entry here:
      idsOfHabitsMissedOnDate = idsOfHabitsMissedOnDate.filter((habitId) => {
        return habitId != entry.habitId;
      });
    }

    // now, the array only contains habitIds that weren't done on that day,
    // so we append it ot the habitsMissedSoFar array:
    idsOfHabitsMissedSoFar.push(idsOfHabitsMissedOnDate);
  }

  return idsOfHabitsMissedSoFar;
}

export function getMissedHabitIdsOnDate(date: Date): string[] {
  const allHabits = getAllHabits();

  const habitFrequencies: Record<string, boolean[]> = {}; // a map, with
  // keys being habitId, and value being frequency (boolean[])
  for (const habit of allHabits) {
    habitFrequencies[habit.id] = habit.frequency;
  }

  let idsOfHabitsMissedOnDate = getIdsOfHabitsDueOnWeekday(date);
  const entriesOnDate = getAllHabitHistoryEntriesOnDate(date);

  for (const entry of entriesOnDate) {
    // keep removing elements from idsOfHabitsToBeDoneOnDate when find it
    // in an entry here:
    idsOfHabitsMissedOnDate = idsOfHabitsMissedOnDate.filter((habitId) => {
      return habitId != entry.habitId;
    });
  }

  return idsOfHabitsMissedOnDate;
}

function daysUserMissedHabitSinceLastCompletion(habitId: string) {
  const entries = getAllHabitHistory(); // objects that contain date of completion in them

  for (let i = entries.length - 1; i >= 0; i++) {
    // looping in reverse (new records are later in array), finding the last time the user completed that habit:
    if (entries[i].habitId == habitId) {
      // found a habit being done

      const lastHabitCompletionDate = getDateFromFormattedDate(
        entries[i].completionDate
      ); // returns a Date object
      const habitFrequency = getHabitObjectFromId(habitId)!.frequency; // array of true and falses, 0 is sunday, 6 is saturday

      // the plan is to recreate our own habitFrequency (the practical/experimental one),
      // and compare it to the habitFrequency (theoretical)
      // the number of points where it is not matching is the times
      // the user missed the habits
      // however, since the user could miss habits for more than one week,
      // we gotta create as many arrays as there are weeks difference

      const weeksToCompare =
        getWeekNumber(getDate()) - getWeekNumber(lastHabitCompletionDate) + 1; // adding one because if both week numbers are same, we still have to compare
      // THE ABOVE STATEMENT WILL CRASH IF IT IS THE NEW YEAR

      const observedFrequency = []; // what the user actually did
      const experimentalFrequency = []; // what the user was supposed to do
      for (let i = 0; i < weeksToCompare; i++) {
        observedFrequency.push(new Array(7).fill(false));
        experimentalFrequency.push([...habitFrequency]);

        // replace the false with the time the user completed the habit
        if (i == 0) {
          // setting the habit to true in only the first week (actual week when the user last completed their habit)
          observedFrequency[i][getWeekdayNumber(lastHabitCompletionDate)] =
            true;
        }

        // cutting the weeksToCompare array's experimentalFrequency array to only reflect the week on and after the last habit was done (this is assuming that the days previous to that were already handled)
        // therefore splicing all the frequency items to keep the last part (except the latest week, we keep the first part cuz the last part hasn't come yet)

        // BUG: DOESN'T DEAL WITH IF THE WEEKS TO COMPARE IS 1 ONLY (need to do both operations below in that case)
        if (weeksToCompare == 1) {
          // if there's only one week to compare, have to cut items from both start and end
          observedFrequency[i].length = getWeekdayNumber(getDate());
          experimentalFrequency[i].length = getWeekdayNumber(getDate());

          observedFrequency[i].splice(
            0,
            getWeekdayNumber(lastHabitCompletionDate)
          );

          experimentalFrequency[i].splice(
            0,
            getWeekdayNumber(lastHabitCompletionDate)
          );
        } else if (i == 0) {
          // if weeks to comprare > 1, and we're editing the first week
          // chop off passed dates from first
          observedFrequency[i].splice(
            0,
            getWeekdayNumber(lastHabitCompletionDate)
          );

          // now we match the length of observed array to the experimental frequency (truncated accordingly)
          experimentalFrequency[i].splice(
            0,
            getWeekdayNumber(lastHabitCompletionDate)
          );
        } else if (i == weeksToCompare - 1) {
          // if weeks to compare > 1, and we're editing the last week
          // chop off future dates from the last
          observedFrequency[i].length = getWeekdayNumber(getDate());
          experimentalFrequency[i].length = getWeekdayNumber(getDate());
          // this makes it so that today is excluded as well
        }
      }

      // now it's the time to compare the contents of the observed and experimental frequency arrays
      // if an item does not match, it means that the user did not do the habit that day
      // think today is friday and I last completed my MWF habit on monday
      // eg: observed item for a week: [false, true, false, false, false, false, false] -> assume today is friday and we haven't completed that, so it not count
      // experimental for same week  : [false, true, false, true, false, true, false]
      // we splice and shorten these arrays to convert them into:
      // observed truncated  : [true, false, false, false], contains days between last completed and before today
      // experimental trunc. : [true, false, true, false],
      // therefore, the only difference there is of 1, so we didn't complete habit 1 time since last completion

      let timesMissedSinceLastCompletion = 0;

      for (let i = 0; i < observedFrequency.length; i++) {
        for (let j = 0; j < observedFrequency[i].length; j++) {
          if (observedFrequency[i][j] != experimentalFrequency[i][j]) {
            timesMissedSinceLastCompletion++;
          }
        }
      }

      return timesMissedSinceLastCompletion;
    }
  }
  return 0; // in the case of unhandled exceptions, we return 0
  // to be forgiving towards the user
}
function shouldCollectDataForHabit(habitId: string) {
  const habitFrequency = getHabitObjectFromId(habitId)!.frequency;
  if (habitFrequency[getWeekdayNumber()]) {
    return true;
  }
  return false;
}
function shouldCollectData() {
  const formattedDateToday = getFormattedDate();

  const lastDataCollectionDate = mmkvStorage.getString(
    "lastDataCollectionDate"
  );
  if (lastDataCollectionDate) {
    if (
      // doing this so that I get consistent dates while comparing the same day
      // (if app opened at a later time in the day, it would stil run if not do this trickery)
      getDateFromFormattedDate(formattedDateToday) >
      getDateFromFormattedDate(lastDataCollectionDate)
    ) {
      return true;
    }

    return false;
  } else {
    // there's nothing in the mmkvStorage, we create an entry ourselves (arbitrary past entry)
    mmkvStorage.set("lastDataCollectionDate", "1919-12-25");
    return true;
  }
}
