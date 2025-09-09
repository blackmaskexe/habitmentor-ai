import { getMetadataRecords } from "@/utils/database/dailyMetadataRecords";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";

const functionInstance = getFunctions();

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
    const getRecommendations = httpsCallable(
      functionInstance,
      "getProActiveRecommendationResponse"
    );

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
 * Calls the 'getRecommendations' Cloud Function to get an emotion-aware suggestion.
 */
export async function getEmotionAwareSuggestion() {
  try {
    const getRecommendations = httpsCallable(
      functionInstance,
      "getEmotionAwareSuggestionResponse"
    );

    // Call the function with userData payload for emotion-aware suggestions
    const response = await getRecommendations({
      userData: {
        dailyMetadataRecords: JSON.stringify(getMetadataRecords(7)), // sending metadata records for the last 7 days
      },
    });

    // Extract the actual data from Firebase Functions response
    // Firebase Functions return: { data: "your actual response string" }
    // But your code expects: { data: "response string" }
    return {
      data:
        typeof response.data === "string"
          ? response.data
          : "No emotion-aware suggestion available",
    };
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT GET EMOTION AWARE SUGGESTION", err);
    return {
      data: "Could not get emotion aware suggestion. Please try again later.",
    };
  }
}
