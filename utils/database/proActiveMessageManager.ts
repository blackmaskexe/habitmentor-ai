import { getDateFromFormattedDate, getFormattedDate } from "../date";
import mmkvStorage from "../mmkvStorage";
import {
  getHabitCompletionCollection,
  getImportantMessages,
} from "./dataCollectionHelper";

function shouldRequestProActiveMessage() {
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

export async function getProActiveMessage(
  setProActiveCallback: (message: string) => any
) {
  if (shouldRequestProActiveMessage()) {
    console.log("we should lol");
    // this is the part where I send all of the metadata and related information of user's habits
    // to the fine tuned ai model, and return whatever it gives out
    console.log(
      "no you got a sports car",
      "habitCompletionCollection:",
      await getHabitCompletionCollection()
    );
    console.log(
      "We can unun in it",
      "importantMessages:",
      await getImportantMessages()
    );

    setProActiveCallback("proActiveMessage as received from the AI");
    return true;
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

    return false;
    // or return null and have a case
  }
}
