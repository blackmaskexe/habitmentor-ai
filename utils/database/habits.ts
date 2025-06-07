// this file is based off the activeHabits key found in the mmkvStorage
import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";

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
