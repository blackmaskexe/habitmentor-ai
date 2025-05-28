// data collection keys:
// missedHabits
// importantMessages
// consistencyData:
//      number of habits completed on monday, tuesday, ...
//      number of habits completed in january, ....
//      most consistent habit
//      least consistent habits
//      which day the user is most consistent on

import { HabitObject } from "../types";
import mmkvStorage from "../mmkvStorage";
import { getFormattedDate } from "../date";

type MissedHabitsStoreType = {
  [dateString: string]: HabitObject[]; // key is formatted date, value is array of missed habits
};

export function addMissedHabits(missedHabits: HabitObject[], missedDate: Date) {
  const oldMissedHabits: MissedHabitsStoreType = JSON.parse(
    mmkvStorage.getString("missedHabits") || "{}"
  );

  oldMissedHabits[getFormattedDate()] = [...missedHabits];
  mmkvStorage.set("missedHabits", JSON.stringify(oldMissedHabits));
}

export function addImportantMessage(importantMessage: string) {
  // messages that will be sent to AI for better responses
  const oldImportantMessages = JSON.parse(
    mmkvStorage.getString("importantMessages") || "[]"
  );

  mmkvStorage.set(
    "importantMessages",
    JSON.stringify([...oldImportantMessages, importantMessage])
  );
}
