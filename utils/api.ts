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

// ------------------------------
// TYPES FOR API HELPER FUNCTIONS
// ------------------------------

type UserPromptType = {
  message: string;
  importantMessageHistory?: string[];
  metadata?: any;
  // recentMissedHabits?: string[];
  timeOfDay?: "morning" | "afternoon" | "evening";
  // preferredTone?: string;
};

type AIResponseType = {
  data: {
    actionableSteps: string[];
    importantMessage: boolean;
    response: string;
  };
};

// --------------------
// API HELPER FUNCTIONS
// --------------------

/**
 * Calls the 'getRecommendations' Cloud Function to get a proactive suggestion.
 * @param habitCompletionCollection - The user's habit completion data.
 * @param importantMessages - A list of important messages from previous interactions.
 */
export async function getProActiveMessage(
  habitCompletionCollection: any,
  importantMessages: string[]
): Promise<{ data: { response: string } }> {
  try {
    // Get a reference to the getRecommendations Cloud Function
    const getRecommendations = functions().httpsCallable("getRecommendations");

    // Call the function with userData payload that matches backend expectations
    const response = await getRecommendations({
      userData: {
        habitCompletionCollection: habitCompletionCollection,
        importantMessages: importantMessages,
      },
    });

    // Firebase Functions return data directly, wrap to match expected structure
    return {
      data: {
        response:
          typeof response.data === "string"
            ? response.data
            : "No suggestion available",
      },
    };
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT FETCH PRO ACTIVE MESSAGE", err);
    return {
      data: {
        response: "Unable to fetch AI Suggestion Message. Try again later",
      },
    };
  }
}

/**
 * Calls the 'getChatResponse' Cloud Function to get a response to a user's message.
 * @param userMessage - The message typed by the user.
 * @param recentMessageHistory - The last few messages in the current conversation.
 */
export async function getChatMessage(
  userMessage: string,
  recentMessageHistory: any
): Promise<AIResponseType> {
  try {
    const getChatResponse = functions().httpsCallable("getChatResponse");

    // Construct the messages payload that matches backend expectations
    const messages = {
      message: userMessage,
      importantMessageHistory: await getImportantMessages(20), // limit of 50
      recentMessageHistory: recentMessageHistory, // send the last 20 messages in the payload
      timeOfDay: getTimeOfDay(),
      metadata: {
        activeHabits: getAllHabits(),
        habitCompletions: await getHabitCompletionCollection(),
      },
    };

    const response = await getChatResponse({ messages });

    // The SDK nests the return value in response.data, which matches your old structure.
    return response as AIResponseType;
  } catch (err) {
    console.log(
      "CRITICAL ERROR, COULD NOT FETCH CHAT MESSAGE FROM AI API",
      err
    );
    return {
      data: {
        response: "Unable to fetch Chat Message. Try again later",
        actionableSteps: [],
        importantMessage: false,
      },
    };
  }
}

/**
 * Calls the 'getRecommendations' Cloud Function to get an emotion-aware suggestion.
 */
export async function getEmotionAwareSuggestion() {
  try {
    const getRecommendations = functions().httpsCallable("getRecommendations");

    // Call the function with userData payload for emotion-aware suggestions
    const response = await getRecommendations({
      userData: {
        dailyMetadataRecords: getMetadataRecords(7), // sending metadata records for the last 7 days
      },
    });

    return response;
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT GET EMOTION AWARE SUGGESTION", err);
    return {
      data: {
        response:
          "Could not get emotion aware suggestion. Please try again later.",
      },
    };
  }
}

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
