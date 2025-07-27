// this file is based off the activeHabits key found in the mmkvStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDate, getDateFromFormattedTime, getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import { HabitObject } from "../types";
import { onMarkAsComplete } from "./habitHistoryManager";
import database from "./watermelon";
import { Q } from "@nozbe/watermelondb";
import HabitCompletion from "./watermelon/model/HabitCompletion";

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

export function updateHabit(habitId: string, newHabitObject: HabitObject) {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  activeHabits.map((habitItem) => {
    if (habitItem.id != habitId) {
      return {
        ...habitItem,
      };
    }

    // modify only the habit whose habit id matches, and then return the new one

    return {
      ...newHabitObject,
    };
  });

  mmkvStorage.set("activeHabits", JSON.stringify(activeHabits));
}

export function getAllHabits() {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  return activeHabits;
}

export function getAllHabitsOnWeekday(weekdayNumber: number) {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  return activeHabits.filter((habit, index) => {
    console.log(
      "disama i give you all da ga, gimme all for dis, i need confidence in msyelf",
      habit
    );
    return habit.frequency[weekdayNumber]; // only those habits will be returned that are active on that weekday
  });
}

export function getTotalHabitNumberOnDay(weekdayNumber: number) {
  try {
    const allHabits = getAllHabits();
    let totalNum = 0;
    for (const habit of allHabits) {
      if (habit.frequency[weekdayNumber]) {
        totalNum++;
      }
    }

    return totalNum;
  } catch (err) {
    return 0; // this case would not hit, but doing because the old version didn't have this logic and people's app is crashing because of it.
  }
}

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

export async function eraseAllHabitData() {
  // first, loggin the user out of the app (so that mmkv can be safely cleared)
  AsyncStorage.setItem("hasOnboarded", "false");
  // then clearing all the shid in the tigrelini watermelini db:
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
  // then uda-ing mmkv as a whole
  mmkvStorage.clearAll();
}

export function deleteHabit(habitId: string, keepData?: boolean) {
  // TODO: implement the logic of keepData (the user is prompted to keep data orn ot, if not kept then delete the entries from the databases as wella)

  // getting all habits from mmkv
  const allHabits = getAllHabits();

  const updatedHabits = allHabits.filter((habit, index) => {
    return habit.id != habitId;
  });

  // place the habits in the deleted habits mmkv array (for rememberance purposes? idk)

  // finally set the value of the updated habits
  mmkvStorage.set("activeHabits", JSON.stringify(updatedHabits));
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

export async function updateEditedHabit(
  habitId: string,
  updatedName: string,
  updatedDescription: string,
  updatedFrequency: boolean[],
  cancelAllScheduledNotifications: () => Promise<void>,
  schedulePushNotification: (time: Date, habit: HabitObject) => Promise<void>
) {
  console.log(
    "anywhere door se bitches pe jaa",
    updatedName,
    updatedDescription,
    updatedFrequency
  );
  // looking up which actual things were changed, therefore need unchanged habit to compare with:
  const unchangedHabit = getHabitObjectFromId(habitId)!; // this is the unchanged version of the edited habit

  // seeing which all fields were changed (prevent unnecessary operations from tigrelini watermelini db)
  let didNameChange = unchangedHabit.habitName != updatedName;

  // catching falsy name values under the didNameChange variable: (mmkv goes hay if habitname is something falsy)
  if (!updatedName) {
    didNameChange = false;
  }

  const didDescriptionChange =
    unchangedHabit.habitDescription != updatedDescription;
  const didFrequencyChange =
    JSON.stringify(updatedFrequency) !=
    JSON.stringify(unchangedHabit.frequency);

  // updating the mmkvStorage with the new updated habit information
  const updatedHabits = getAllHabits().map((habit) => {
    if (habit.id == habitId) {
      return {
        // not checking for changes between the two versions, mmkv is fast enough to not care
        ...habit,
        habitName: didNameChange ? updatedName : habit.habitName,
        habitDescription: didDescriptionChange
          ? updatedDescription
          : habit.habitDescription,
        frequency: didFrequencyChange ? updatedFrequency : habit.frequency,
      };
    }

    return habit;
  });

  mmkvStorage.set("activeHabits", JSON.stringify(updatedHabits));

  // updating the tables in tigrelini watermelini db:
  if (didNameChange) {
    // if name changed, update associated watermelondb record in habit completions table
    await database.write(async () => {
      const habitCompletionCollection =
        database.get<HabitCompletion>("habit_completions");
      const habitRecord = await habitCompletionCollection
        .query(Q.where("habit_id", habitId))
        .fetch();

      if (habitRecord.length > 0) {
        // if this record exists (safety check)
        await habitRecord[0].update((habit) => {
          habit.habitName = updatedName;
        });
      }
    });
  }

  if (didFrequencyChange) {
    console.log("BUT ON THURSDAYYYYY");
    // we will turn off and on notifications
    // turning off internall cancel all notifications
    // turning back on will pick up the latest frequency to schedule the notifications on

    // this is the same functionality as in the "Enable Reminder Notificaitons" switch in the settings

    // first resetting
    resetAllHabitNotifications();
    await cancelAllScheduledNotifications();

    // then enabling back for all
    for (const habit of getAllHabits()) {
      if (habit.notificationIds && habit.notificationTime) {
        schedulePushNotification(
          getDateFromFormattedTime(habit.notificationTime),
          getHabitObjectFromId(habit.id)!
        );
      }
    }
  }
}
