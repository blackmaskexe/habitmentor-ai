// contains logic related to getting / setting habits based on their frequency

import { getDate, getDatesLastWeek, getDatesThisWeek } from "../date";
import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";
import { getAllHabitHistoryEntriesOnDate } from "./habitHistoryManager";
import { getAllHabits, getHabitObjectFromId } from "./habitService";

// return all the habits that are due on the particular weekday
export function getAllHabitsOnWeekday(weekdayNumber: number) {
  console.log("Wouldn't do nothing", weekdayNumber);
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  console.log("KANSOL LOG", activeHabits);

  return activeHabits.filter((habit, index) => {
    console.log("HAHAHHA", habit);
    return habit.frequency[weekdayNumber]; // only those habits will be returned that are active on that weekday
  });
}

// calc total number of trues on a particular day in all habit's frequencies
export function getTotalHabitNumberOnDay(weekdayNumber: number) {
  try {
    const allHabits = getAllHabits();
    let totalNum = 0;
    for (const habit of allHabits) {
      console.log("I guess amarestode ", habit);
      if (habit.frequency[weekdayNumber]) {
        totalNum++;
      }
    }

    return totalNum;
  } catch (err) {
    return 0; // this case would not hit, but doing because the old version didn't have this logic and people's app is crashing because of it.
  }
}

// simply return the times there are trues in frequency of a habit
export function getTimesHabitDueEntireWeek(habitId: string) {
  // since the frequency changes for the habits, and there is no track
  // of different versions of the same habit yet, we just use this week
  // to see how many times the habit is supposed to be done
  // as this will be used to display info for the last 2 weeks ish (this week will display info for last week's completion rate)

  let timesDue: number = 0;
  for (const habitFrequencyBoolean of getHabitObjectFromId(habitId)!
    .frequency) {
    if (habitFrequencyBoolean) {
      timesDue++;
    }
  }

  return timesDue;
}
// COMPLETION SUGGESTION CARDS HELPER FUNCTIONS:
// will be used for giving info like "You only completed xyz habit this many times last week / this week"

// LAST WEEK RELATED HELPERS:
export function getTimesCompletedHabitLastWeek(habitId: string) {
  let timesCompletedLastWeek: number = 0;
  const datesLastWeek = getDatesLastWeek();

  for (const date of datesLastWeek) {
    for (const habitHistoryEntry of getAllHabitHistoryEntriesOnDate(date)) {
      // if it finds a habit that was completed on a day, it increments times completed
      if (habitHistoryEntry.habitId == habitId) {
        timesCompletedLastWeek++;
        break;
      }
    }
  }

  return timesCompletedLastWeek;
}

export function getHabitCompletionRatePreviousWeek(habitId: string) {
  const completed = getTimesCompletedHabitLastWeek(habitId);
  const due = getTimesHabitDueEntireWeek(habitId);

  if (due != 0) {
    return Math.trunc((completed * 100) / due);
  } else {
    return 0;
  }

  // looping through all the dates, calculating number of times that habit was done last week:
}

// THIS WEEK RELATED HELPERS:
export function getTimesCompletedHabitThisWeek(habitId: string) {
  let timesCompletedThisWeek = 0;
  const today = getDate();

  // creating an array that contains all the dates from the start of the week until today
  const datesSoFarThisWeek = getDatesThisWeek();
  datesSoFarThisWeek.length = today.getDay() + 1;

  // looping through each date's habit history entries, finding if any match the habitId input
  for (const date of datesSoFarThisWeek) {
    for (const entry of getAllHabitHistoryEntriesOnDate(date)) {
      if (entry.habitId == habitId) {
        timesCompletedThisWeek++;
        break;
      }
    }
  }

  return timesCompletedThisWeek;
}

export function getTimesHabitDueSoFarThisWeek(habitId: string) {
  const habitObject = getHabitObjectFromId(habitId)!;
  const today = getDate();

  // making it so that relevant frequency only contains days uptil the current day of week
  const relevantFrequency = [...habitObject.frequency];
  relevantFrequency.length = today.getDay() + 1;

  let timesDueSoFar = 0;
  for (const frequencyBoolean of relevantFrequency) {
    if (frequencyBoolean) {
      timesDueSoFar++;
    }
  }

  return timesDueSoFar;
}

export function getHabitCompletionRateThisWeek(habitId: string) {
  const completed = getTimesCompletedHabitThisWeek(habitId);
  const due = getTimesHabitDueSoFarThisWeek(habitId);

  if (due != 0) {
    return Math.trunc((completed * 100) / due);
  } else {
    return 0;
  }
}
