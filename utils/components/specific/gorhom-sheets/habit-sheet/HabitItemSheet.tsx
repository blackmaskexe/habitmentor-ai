// habit card
// bunch of options

import { getHabitNotificationTime, getHabitObjectFromId } from "@/utils/habits";
import mmkvStorage from "@/utils/mmkvStorage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import CardWithoutImage from "../../../general/CardWithoutImage";
import EditHabitView from "../../EditHabitView";
import ReminderView from "../../ReminderView";
import ActionSheetIosOptionList from "./ActionSheetIosOptionList";
import { HabitObject } from "@/utils/types";

export default function HabitItemSheet({
  habit,
  habitDate,
  initialDisplayScreen,
  dismiss,
}: {
  habit: HabitObject;
  habitDate: Date;
  initialDisplayScreen?: "main" | "reminder" | "editHabit";
  dismiss: () => void;
}) {
  const [habitObject, setHabitObject] = useState<HabitObject>(
    habit && habit.id
      ? getHabitObjectFromId(habit.id)
      : {
          habitName: "Loading",
          frequency: Array(7).fill(false),
          habitDescription: "Loading...",
          iconName: "accessibility",
          id: "21",
          points: 20,
          isNotificationOn: false,
        }
  );
  const theme = useTheme();
  const styles = createStyles(theme);

  const [displayScreen, setDisplayScreen] = useState<string>(
    initialDisplayScreen ? initialDisplayScreen : "main"
  );
  const [notificationTime, setNotificationTime] = useState<string | undefined>(
    getHabitNotificationTime(habitObject.id)
  );

  useEffect(() => {
    // run on mount, detect changes to activeHabits (if reminder changed, should populate again)
    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "activeHabits") {
        // the reason of key changing could be due to notificaiton setting changing:
        setNotificationTime(getHabitNotificationTime(habitObject.id));

        // or due to the name / description / other settings of the habit changing
        setHabitObject(() => {
          return getHabitObjectFromId(habit.id)!;
        });
      }
    });

    () => {
      listener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.habitItemSheetContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {displayScreen == "main" ? (
        <>
          <CardWithoutImage
            title={habitObject.habitName}
            description={habitObject.habitDescription || ""}
            metadata={
              habitObject.isNotificationOn
                ? "Reminder for: " + notificationTime
                : "No Reminders Set"
            }
          />
          <View
            style={{
              marginBottom: theme.spacing.s,
            }}
          />
          <ActionSheetIosOptionList
            habitItem={habitObject}
            onChangeDisplayScreen={setDisplayScreen}
            habitDate={habitDate}
            dismiss={dismiss}
          />
        </>
      ) : null}

      {displayScreen == "reminder" ? (
        <ReminderView
          onChangeDisplayScreen={setDisplayScreen}
          habitId={habitObject.id}
        />
      ) : null}

      {displayScreen == "editHabit" ? (
        <EditHabitView
          habitId={habitObject.id}
          onChangeDisplayScreen={setDisplayScreen}
          dismissSheet={dismiss}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    habitItemSheetContainer: {
      flex: 1,
      marginVertical: theme.spacing.s,
      borderRadius: theme.radius.m,
      backgroundColor: theme.colors.background,
      marginBottom: theme.spacing.l,
    },
  });
}
