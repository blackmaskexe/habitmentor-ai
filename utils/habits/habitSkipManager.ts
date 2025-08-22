// all the logic related to habit skipping

import { getFormattedDate, getDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import { onMarkAsComplete } from "./habitHistoryManager";
import { getAllHabits } from "./habitService";

export function skipHabitToday(habitId: string, date: Date) {
  if (getFormattedDate(getDate()) != getFormattedDate(date)) return; // cannot skip habits other than for today

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
