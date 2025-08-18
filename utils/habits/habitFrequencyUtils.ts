// contains logic related to getting / setting habits based on their frequency

import { getDatesLastWeek } from "../date";
import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";
import { getAllHabitHistoryEntriesOnDate } from "./habitHistoryManager";
import { getAllHabits, getHabitObjectFromId } from "./habitService";

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

// will be used for giving info like "You only completed xyz habit this many times last week"
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

export function getTimesHabitDueOnWeek(habitId: string) {
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

export function getHabitCompletionRatePreviousWeek(habitId: string) {
  const completed = getTimesCompletedHabitLastWeek(habitId);
  const due = getTimesHabitDueOnWeek(habitId);

  if (due != 0) {
    return Math.trunc((completed * 100) / due);
  } else {
    return 0;
  }

  // looping through all the dates, calculating number of times that habit was done last week:
}
