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
// isNotificationOn: stores if the user wants to have their notifications on or off
