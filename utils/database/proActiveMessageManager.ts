import api from "../api";
import { getDateFromFormattedDate, getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import {
  getHabitCompletionCollection,
  getImportantMessages,
} from "./dataCollectionHelper";

function shouldRequestProActiveMessage() {
  return true; // for debugging purposes, YOU'LL RUN WHEN RUNEN TO
  const formattedDateToday = getFormattedDate();
  const lastProActiveMessageDate = mmkvStorage.getString(
    "lastProActiveMessageDate"
  );
  if (lastProActiveMessageDate) {
    if (
      getDateFromFormattedDate(formattedDateToday) >
      getDateFromFormattedDate(lastProActiveMessageDate)
    ) {
      mmkvStorage.set("lastProActiveMessageDate", formattedDateToday);
      return true;
    } else {
      return false;
    }
  } else {
    mmkvStorage.set("lastProActiveMessageDate", "1919-12-25"); // set date in the past to get this key-pair initialized
    return true;
  }
}

export async function showProActiveMessage(
  setProActiveCallback: (message: string) => any
) {
  if (shouldRequestProActiveMessage()) {
    console.log("we should lol");
    // this is the part where I send all of the metadata and related information of user's habits
    // to the fine tuned ai model, and return whatever it gives out

    const response = await api.post("/pro-active", {
      habitCompletionCollection: await getHabitCompletionCollection(),
      importantMessages: await getImportantMessages(),
    });

    console.log(response);

    setProActiveCallback("proActiveMessage as received from the AI");
  } else {
    console.log("we shouldn't");
    console.log(
      "I think you wanna wanna",
      "habitCompletionCollection:",
      await getHabitCompletionCollection()
    );
    console.log(
      "I think you got a sports car, and you drive it real fast, yeah you know what this is",
      "importantMessages:",
      await getImportantMessages()
    );
  }
}
