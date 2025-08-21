import { Ionicons } from "@expo/vector-icons";
import { getDate, getDatesThisWeek, getFormattedDatesThisWeek } from "../date";
import mmkvStorage from "../mmkvStorage";
import {
  getHabitCompletionRatePreviousWeek,
  getHabitCompletionRateThisWeek,
} from "./habitFrequencyUtils";
import { getAllHabits, getHabitObjectFromId } from "./habitService";
import lodash from "lodash";
import { getAllHabitHistoryEntriesOnDate } from "./habitHistoryManager";

type LeastCompletedHabitMetadata = {
  habitId: string;
  habitName: string;
  ioniconName: keyof typeof Ionicons.glyphMap;
  completionPercentageLastWeek: number;
};

type CompletionsData = {
  x: string;
  y: number | null;
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

// returns an array of number of completions so far this week (each element is a weekday)
export function getWeeklyHabitCompletionsCountData() {
  const datesThisWeek = getDatesThisWeek();
  // datesThisWeek.length = getDate().getDay() + 1; // shrinks the array of only contains days uptil today

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const completionsSoFar: CompletionsData[] = [];
  for (let i = 0; i < datesThisWeek.length; i++) {
    // habits completed for this particular day:
    const completionsArray = getAllHabitHistoryEntriesOnDate(datesThisWeek[i]);

    const completionsData: CompletionsData = {
      x: weekdays[i],
      y: datesThisWeek[i] <= getDate() ? completionsArray.length : null, // basically makes it so that
      // all the bars are rendred for react-native-chart-kit, but days that are in future are
      // noted by null so no number shows next to them (if it is 0, it will show 0. If it is null, it wont show)
    };
    completionsSoFar.push(completionsData);
  }

  return completionsSoFar;
}
