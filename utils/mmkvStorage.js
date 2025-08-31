import { MMKV } from "react-native-mmkv";

const mmkvStorage = new MMKV();

export default mmkvStorage;

// the following are the key value stores being used inside the app:

// coreHabits: array of the 3 habit objects that the user sets during onboarding
// activeHabits: array of all the habits that the user is currently doing
// moreHabits: array of all the potential / future habits that the user would want to do
// habitHistory: A database-like array of all the past completed habits from the user
// lastDataCollectionDate: formatted date of the last time the habit data collection helper function was run
// lastProActiveMessageDate: the last date the server fetched pro-active advice for the user to display on the homescreen
// recentProActiveMessage: gives the last fetched pro active message from the server
// didTourApp: true or false based on whether the rn-tourguide triggered for the user, as only want it to happen once
// skipsLeft: stores how many skips does the user have remaining for the week, and is recalculated each week on sunday
// isNotificationOn: stores if the user wants to have their notifications on or off -> this is for the entire app; each habitObject has it's own isNotificationOn property too
// appStartDate: formatted date on which the user started the habit tracker app
// dailyRecords: Array of daily records for users habits and actions. this will store stuff like moodRating, habitCompletionRate (you felt on average happy last week, and you completed 55% of the tasks. Let's improve on that, typeshi), tagsOfHabitsMIssed (or missedHabits[] ?).
// lastEmotionAwareSuggestionDate: the last time emotion aware suggestion api was called
// recentEmotionAwareSuggestion: the most recent message that was given by emotion aware ai
// totalPoints: the points of the user's habits that they accumulate over time
// leaderboardProfile: the same stuff stored in firestore (the same stuff, but during the initial creation of their profile + at any updations)
