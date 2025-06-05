import api from "../api";
import { getDateFromFormattedDate, getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import {
  getHabitCompletionCollection,
  getImportantMessages,
} from "./dataCollectionHelper";

export function shouldRequestProActiveMessage() {
  // return true; // for debugging purposes, YOU'LL RUN WHEN RUNEN TO
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
  setProActiveCallback: (message: string | null) => any
) {
  if (shouldRequestProActiveMessage()) {
    // for testing purpose rn
    // this is the part where I send all of the metadata and related information of user's habits
    // to the fine tuned ai model, and return whatever it gives out

    const response = await api.post("/pro-active", {
      habitCompletionCollection: await getHabitCompletionCollection(),
      importantMessages: await getImportantMessages(),
    });

    if (response && response.data.response) {
      setProActiveCallback(response.data.response);
    }
  } else {
    console.log("You don't have to fetch the important messages bro");
  }
}
