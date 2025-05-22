// this file is based off the activeHabits key found in the mmkvStorage
import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";

export function updateHabitNotificationId(
  habitId: string,
  notificationId: string
) {
  // getting the activeHabits from mmkvStorage:
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  // looping through the currentActiveHabits array, setting the notificationId to the new one:
  for (const habit of activeHabits) {
    if (habit.id == habitId) {
      habit.notificationId = notificationId;
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
