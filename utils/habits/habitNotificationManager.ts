// logic related to handling notifications of habitss

import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";
import { getAllHabits } from "./habitService";

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
      habit.isNotificationOn = true;
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
      habit.isNotificationOn = true;
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

export function resetHabitNotification(habitId: string) {
  const allHabits = getAllHabits();

  const updatedAllHabits = allHabits.map((habit, index) => {
    if (habit.id == habitId) {
      const { notificationIds, notificationTime, ...restOfHabit } = habit;
      return restOfHabit;
    } else {
      return habit;
    }
  });

  mmkvStorage.set("activeHabits", JSON.stringify(updatedAllHabits));
}

export function resetAllHabitNotifications() {
  const allHabits = getAllHabits();

  const updatedAllHabits = allHabits.map((habit, index) => {
    return {
      ...habit,
      isNotificationOn: false,
    };
  });

  mmkvStorage.set("activeHabits", JSON.stringify(updatedAllHabits));
}
