// this file is based off the activeHabits key found in the mmkvStorage
import { getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";
import { onMarkAsComplete } from "./habitHistoryManager";

export function updateHabitNotificationId(
  habitId: string,
  notificationIdArray: string[]
) {
  // getting the activeHabits from mmkvStorage:
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  // looping through the currentActiveHabits array, setting the notificationId to the new one:
  for (const habit of activeHabits) {
    if (habit.id == habitId) {
      habit.notificationIds = notificationIdArray;
    }
  }

  mmkvStorage.set("activeHabits", JSON.stringify(activeHabits));
}

export function updateHabitNotificationTime(habitId: string, time: string) {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  // looping through the currentActiveHabits array, setting the notificationId to the new one:
  for (const habit of activeHabits) {
    if (habit.id == habitId) {
      habit.notificationTime = time;
    }
  }

  mmkvStorage.set("activeHabits", JSON.stringify(activeHabits));
}

export function getHabitNotificationTime(habitId: string) {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  // looping through the currentActiveHabits array, setting the notificationId to the new one:
  for (const habit of activeHabits) {
    if (habit.id == habitId) {
      return habit.notificationTime;
    }
  }

  return undefined;
}

export function getHabitObjectFromId(habitId: string) {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  // looping through the currentActiveHabits array, return the object if found
  for (const habit of activeHabits) {
    if (habit.id == habitId) {
      return habit;
    }
  }
}

export function addNewHabit(newHabitObject: HabitObject) {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  mmkvStorage.set(
    "activeHabits",
    JSON.stringify([...activeHabits, newHabitObject])
  );
}

export function getAllHabits() {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  return activeHabits;
}

export function getTotalHabitNumberOnDay(weekdayNumber: number) {
  const allHabits = getAllHabits();
  let totalNum = 0;
  for (const habit of allHabits) {
    if (habit.frequency[weekdayNumber]) {
      totalNum++;
    }
  }

  return totalNum;
}

export function skipHabitToday(habitId: string, date: Date) {
  if (getFormattedDate(new Date()) != getFormattedDate(date)) return; // cannot skip habits other than for today

  if (!shouldSkipHabit()) return; // early return if the user cant skip a habit

  reduceSkips();
  onMarkAsComplete(habitId, date, true); // specify skip = true
}

function shouldSkipHabit() {
  // concept: the user only gets 1 skip per habit each week.
  const currentSkipsLeft = mmkvStorage.getNumber("skipsLeft");
  if (currentSkipsLeft == undefined) {
    awardSkips(); // for the case if the user first downloads the app, and it's not a sunday ( 6/7 * 100 % chance for that lol)
    return true;
  }
  if (currentSkipsLeft == 0 || currentSkipsLeft < 0) {
    return false;
  }
  return true; // return true in the remaining case where there is something in the tank
}

function reduceSkips() {
  const currentSkipsLeft = mmkvStorage.getNumber("skipsLeft");
  if (currentSkipsLeft == undefined) {
    awardSkips();
  } else if (currentSkipsLeft == 0 || currentSkipsLeft < 0) return; // early return safeguard (I know I won't hit it but just incase)

  mmkvStorage.set("skipsLeft", currentSkipsLeft! - 1);
}

function awardSkips() {
  // this function will be ran once each week

  // getting the number of habit the user has:
  const numberOfHabits = getAllHabits().length;

  mmkvStorage.set("skipsLeft", numberOfHabits);
}

export function getRemainingSkips() {
  const currentSkipsLeft = mmkvStorage.getNumber("skipsLeft");
  if (currentSkipsLeft == undefined) {
    awardSkips(); // for the case if the user first downloads the app, and it's not a sunday ( 6/7 * 100 % chance for that lol)
  }

  return mmkvStorage.getNumber("skipsLeft");
}
