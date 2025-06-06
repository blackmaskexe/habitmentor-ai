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

export function setRecentProActiveMessage(message: string) {
  mmkvStorage.set("recentProActiveMessage", message);
}

export function getRecentProActiveMessage() {
  const recentMessage = mmkvStorage.getString("recentProActiveMessage");
  if (recentMessage) {
    return recentMessage;
  }
  return "Loading...";
}
