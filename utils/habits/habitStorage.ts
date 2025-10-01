import {
  getAllHabits,
  getHabitObjectFromId,
  resetAllHabitNotifications,
} from "@/utils/habits";
import { getDateFromFormattedTime } from "../date";
import database from "../database/watermelon";
import mmkvStorage from "../mmkvStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HabitObject } from "../types";
import HabitCompletion from "../database/watermelon/model/HabitCompletion";
import { Q } from "@nozbe/watermelondb";

// logic related to mmkvstorate helpers
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
