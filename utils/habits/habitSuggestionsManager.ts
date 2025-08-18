import { getFormattedDatesThisWeek } from "../date";
import mmkvStorage from "../mmkvStorage";
import {
  getHabitCompletionRatePreviousWeek,
  getHabitCompletionRateThisWeek,
} from "./habitFrequencyUtils";
import { getAllHabits, getHabitObjectFromId } from "./habitService";
import lodash from "lodash";

type LeastCompletedHabitMetadata = {
  habitId: string;
  habitName: string;
  ioniconName: string;
  completionPercentageLastWeek: number;
};

export function getLeastCompletedHabitMetadataLastWeek() {
  // EARLY RETURN IF THE START DATE LIES IN THE CURRENT WEEK
  const formattedDatesThisWeek = getFormattedDatesThisWeek();
  if (formattedDatesThisWeek.includes(mmkvStorage.getString("appStartDate")!)) {
    return getLeastCompletedHabitMetadataThisWeek();
    // logic behind is, since the current week is the only week
    // and there is no last week
    // by error if someone messes up and does bad code to still
    // show last week card, it will just show stuff related to this week
    // and not break
  }

  // looping through all available habits, find their completion rate, find out the lowest among them:
  let lowestCompletedHabitId;
  let lowestCompletionPercentage = 100;

  for (const habit of getAllHabits()) {
    const completionPercentage = getHabitCompletionRatePreviousWeek(habit.id);
    if (completionPercentage < lowestCompletionPercentage) {
      // if it finds a completion percentage lower, it changes both variables
      lowestCompletionPercentage = completionPercentage;
      lowestCompletedHabitId = habit.id;
    }
  }

  if (lowestCompletedHabitId) {
    const lowestCompletedHabit = getHabitObjectFromId(lowestCompletedHabitId)!;

    const leastCompletedHabitMetadata: LeastCompletedHabitMetadata = {
      habitId: lowestCompletedHabitId,
      habitName: lowestCompletedHabit.habitName,
      ioniconName: lowestCompletedHabit.iconName,
      completionPercentageLastWeek: lowestCompletionPercentage,
    };
    return leastCompletedHabitMetadata;
  } else {
    // if for some reason something fails, just give metadata for a random habit

    const randomHabit = lodash.sample(getAllHabits()) || getAllHabits()[0];
    const leastCompletedHabitMetadata: LeastCompletedHabitMetadata = {
      habitId: randomHabit.id,
      habitName: randomHabit.habitName,
      ioniconName: randomHabit.iconName,
      completionPercentageLastWeek: getHabitCompletionRatePreviousWeek(
        randomHabit.id
      ),
    };

    return leastCompletedHabitMetadata;
  }
}

export function getLeastCompletedHabitMetadataThisWeek() {
  // looping through all available habits, find their completion rate, find out the lowest among them:
  let lowestCompletedHabitId;
  let lowestCompletionPercentage = 100;

  for (const habit of getAllHabits()) {
    const completionPercentage = getHabitCompletionRateThisWeek(habit.id);
    if (completionPercentage < lowestCompletionPercentage) {
      // if it finds a completion percentage lower, it changes both variables
      lowestCompletionPercentage = completionPercentage;
      lowestCompletedHabitId = habit.id;
    }
  }

  if (lowestCompletedHabitId) {
    const lowestCompletedHabit = getHabitObjectFromId(lowestCompletedHabitId)!;

    const leastCompletedHabitMetadata: LeastCompletedHabitMetadata = {
      habitId: lowestCompletedHabitId,
      habitName: lowestCompletedHabit.habitName,
      ioniconName: lowestCompletedHabit.iconName,
      completionPercentageLastWeek: lowestCompletionPercentage,
    };
    return leastCompletedHabitMetadata;
  } else {
    // if for some reason something fails, just give metadata for a random habit

    const randomHabit = lodash.sample(getAllHabits()) || getAllHabits()[0];
    const leastCompletedHabitMetadata: LeastCompletedHabitMetadata = {
      habitId: randomHabit.id,
      habitName: randomHabit.habitName,
      ioniconName: randomHabit.iconName,
      completionPercentageLastWeek: getHabitCompletionRateThisWeek(
        randomHabit.id
      ),
    };

    return leastCompletedHabitMetadata;
  }
}
