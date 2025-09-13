// service functions for habits

import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";

export function getHabitObjectFromId(habitId: string): HabitObject {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  // looping through the currentActiveHabits array, return the object if found
  for (const habit of activeHabits) {
    if (habit.id == habitId) {
      return habit;
    }
  }

  return {
    habitName: "Loading",
    frequency: Array(7).fill(false),
    habitDescription: "Loading...",
    iconName: "accessibility",
    id: "21",
    points: 20,
    isNotificationOn: false,
  };
}

export function getAllHabits() {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  return activeHabits;
}
