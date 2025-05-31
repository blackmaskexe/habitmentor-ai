import {
  getDateFromFormattedDate,
  getWeekdayNumber,
  getWeekNumber,
} from "../date";
import mmkvStorage from "../mmkvStorage";
import { getAllHabitHistory } from "./habitHistoryManager";
import { getHabitObjectFromId } from "./habits";

export function timesUserMissedHabitSinceLastCompletion(habitId: string) {
  const entries = getAllHabitHistory(); // objects that contain date of completion in them

  for (let i = entries.length - 1; i >= 0; i++) {
    // looping in reverse, finding the last time the user completed that habit:
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
        getWeekNumber(lastHabitCompletionDate) - getWeekNumber(new Date()) + 1; // adding one because if both week numbers are same, we still have to compare
      // THE ABOVE STATEMENT WILL CRASH IF IT IS THE NEW YEAR

      const observedFrequency = [];
      const experimentalFrequency = [];
      for (let i = 0; i < weeksToCompare; i++) {
        observedFrequency.push(new Array(7).fill(false));
        experimentalFrequency.push([...habitFrequency]);

        // replace the false with the time the user completed the habit
        observedFrequency[i][getWeekdayNumber(lastHabitCompletionDate)] = true;

        // cutting the weeksToCompare array's experimentalFrequency array to only reflect the week on and after the last habit was done (this is assuming that the days previous to that were already handled)
        // therefore splicing all the frequency items to keep the last part (except the latest week, we keep the first part cuz the last part hasn't come yet)

        // BUG: DOESN'T DEAL WITH IF THE WEEKS TO COMPARE IS 1 ONLY (need to do both operations below in that case)
        if (i != weeksToCompare - 1) {
          observedFrequency[i].splice(
            0,
            getWeekdayNumber(lastHabitCompletionDate)
          );

          // now we match the length of observed array to the experimental frequency (truncated accordingly)
          experimentalFrequency[i].splice(
            0,
            getWeekdayNumber(lastHabitCompletionDate)
          );
        } else {
          observedFrequency[i].length = getWeekdayNumber(new Date());
          experimentalFrequency[i].length = getWeekNumber(new Date());
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
    }
  }
}
