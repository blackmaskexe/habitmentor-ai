import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { HabitObject } from "./types";
import {
  updateHabitNotificationId,
  updateHabitNotificationTime,
} from "./habits";
import { getFormattedTime } from "./date";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState(""); // not used

  // const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
  //   []
  // ); // not implementing notifications for android yet

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined); // used to store the most recent notification that was triggered by the app

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    // if (Platform.OS === "android") {
    //   Notifications.getNotificationChannelsAsync().then((value) =>
    //     setChannels(value ?? [])
    //   );
    // }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }

      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  async function schedulePushNotification(time: Date, habit: HabitObject) {
    console.log("Current habit:", habit);
    const allScheduledNotis = await getAllScheduledNotifications();
    console.log("currently scheduled notis:", allScheduledNotis);
    // checking if there is already an identifier attached to that habit, cancel the previous one first:
    if (habit.notificationIds) {
      console.log(
        habit.notificationIds,
        "bro totally was hiding his other family as well as the notificaitonId"
      );
      for (const notificationId of habit.notificationIds) {
        // cancel all of the scheduled notifications within the notificationIds array to cancel for all (selected) days of the week
        await cancelScheduledNotificationById(notificationId);
      }
    }
    // then proceed with creating a new notification scheduler for EACH day the habit is active:
    const notificationIdArray: string[] = [];
    for (let i = 0; i < habit.frequency.length; i++) {
      const dayOfWeek = i + 1; // calendar trigger assumes 1 = sunday, .... 7 = saturday, so adding one
      if (habit.frequency[i]) {
        // checks for if that habit is to be done on the particular day of the week (frequency[] is array of 7 bools)
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: "HabitMentor AI",
            body: `Gentle reminder for the habit: ${habit.habitName}`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: time.getHours(),
            minute: time.getMinutes(),
            weekday: dayOfWeek,
            repeats: true,
            channelId: "default",
          },
        });
        notificationIdArray.push(identifier);
      }
    }

    if (notificationIdArray) {
      // updating the mmkvStorage activeHabits with the updated notificationIds for all the scheduled days:
      updateHabitNotificationId(habit.id, notificationIdArray);
      // updateHabitNotificationTime(habit.id, getFormattedTime(time)); did this in th reminder view component itself
    }

    console.log(
      "GUESS GUESS GUESS GUESS, YOUR NOTIFICATION IS SCHEDULED FOR ",
      time
    );
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      // doesn't work on simulators
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      console.log(
        "shouldn't use simulator for handling expo token notifications, local notifications are fine"
      );
    }

    return token;
  }

  async function getAllScheduledNotifications() {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        "Retrieved all scheduled notifications:",
        scheduledNotifications
      );
      return scheduledNotifications;
    } catch (error) {
      console.error("Failed to get all scheduled notifications:", error);
      return []; // Return an empty array in case of an error
    }
  }

  async function cancelAllScheduledNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All scheduled notifications were cancelled");
    } catch (err) {
      console.log(err);
    }
  }

  async function cancelScheduledNotificationById(notificationId: string) {
    try {
      const cancelResult = await Notifications.cancelScheduledNotificationAsync(
        notificationId
      );
      console.log("successfully cancelled for id", notificationId);
    } catch (err) {
      console.log("not able to cancel,", err);
    }
  }

  return {
    schedulePushNotification,
    registerForPushNotificationsAsync,
    getAllScheduledNotifications,
    cancelAllScheduledNotifications,
  };
}
