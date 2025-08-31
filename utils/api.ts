import axios from "axios";
import {
  getAllHabits,
  getHabitCompletionCollection,
  getImportantMessages,
} from "./habits";
import { getTimeOfDay } from "./date";
import { getMetadataRecords } from "./database/dailyMetadataRecords";

const apiUrl = "https://api-tp7jjwrliq-uc.a.run.app/";
// const apiUrl = "http://127.0.0.1:5001/habitmentor-ai/us-central1/api/";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // timeout request after 10 seconds
});

export default api;

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

export async function getProActiveMessage(
  habitCompletionCollection: any,
  importantMessages: string[]
) {
  try {
    const response = await api.post("/pro-active", {
      habitCompletionCollection: habitCompletionCollection,
      importantMessages: importantMessages,
    });

    return response;
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT FETCH PRO ACTIVE MESSAGE", err);
    return {
      data: {
        response: "Unable to fetch AI Suggestion Message. Try again later",
      },
    };
  }
}

export async function getChatMessage(
  userMessage: string,
  recentMessageHistory: any
) {
  try {
    const response: AIResponseType = await api.post("/chat", {
      message: userMessage,
      importantMessageHistory: await getImportantMessages(50), // limit of 50
      recentMessageHistory: recentMessageHistory, // send the last 20 messages in the payload
      timeOfDay: getTimeOfDay(),
      metadata: {
        activeHabits: getAllHabits(),
        habitCompletions: await getHabitCompletionCollection(),
      },
    } as UserPromptType);
    return response;
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
    } as AIResponseType;
  }
}

export async function getEmotionAwareSuggestion() {
  try {
    const response = await api.post("/emotion-aware-suggestion", {
      dailyMetadataRecords: JSON.stringify(getMetadataRecords(7)), // sending metadata records for the last 7 days
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
