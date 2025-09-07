import { getTimeOfDay } from "@/utils/date";
import {
  getAllHabits,
  getHabitCompletionCollection,
  getImportantMessages,
} from "@/utils/habits";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";

const functionInstance = getFunctions();

// type UserPromptType = {
//   message: string;
//   importantMessageHistory?: string[];
//   metadata?: any;
//   // recentMissedHabits?: string[];
//   timeOfDay?: "morning" | "afternoon" | "evening";
//   // preferredTone?: string;
// };

type AIResponseType = {
  data: {
    actionableSteps: string[];
    importantMessage: boolean;
    response: string;
  };
};

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
    const getChatResponse = httpsCallable(functionInstance, "getChatResponse");

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
