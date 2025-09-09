import {
  getAllHabits,
  getHabitCompletionCollection,
  getImportantMessages,
} from "./habits";
import { getTimeOfDay } from "./date";
import { getMetadataRecords } from "./database/dailyMetadataRecords";
import functions from "@react-native-firebase/functions";
import mmkvStorage from "./mmkvStorage";
import { HabitObject } from "./types";

export async function tagHabitsOnCloud() {
  try {
    const getTaggingSuggestions = functions().httpsCallable(
      "getTaggingSuggestions"
    );
    const habits: HabitObject[] = JSON.parse(
      mmkvStorage.getString("activeHabits") || "[]"
    );
    const response = await getTaggingSuggestions({
      habits: habits,
    });

    return response;
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT TAG HABITS", err);
    return {
      data: {},
    };
  }
}
