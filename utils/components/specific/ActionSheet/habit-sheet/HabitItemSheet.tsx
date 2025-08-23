// habit card
// bunch of options

import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View, Text } from "react-native";
import CardWithoutImage from "../../../general/CardWithoutImage";
import ReminderView from "../../ReminderView";
import { useCallback, useEffect, useState } from "react";
import { Theme } from "@/utils/theme/themes";
import { HabitObject } from "@/utils/types";
import ActionSheetIosOptionList from "./ActionSheetIosOptionList";
import mmkvStorage from "@/utils/mmkvStorage";
import { getHabitNotificationTime, getHabitObjectFromId } from "@/utils/habits";
import { useFocusEffect } from "expo-router";
import EditHabitView from "../../EditHabitView";

// SheetManager.show("habit-sheet", {
//   payload: {
//     sheetType: "habitItem",
//     habitItem: {
//       habit: habit,
//       habitIndex: index,
//     },
//   },
// });

export default function HabitItemSheet({
  habitId,
  habitDate,
  initialDisplayScreen,
}: {
  habitId: string;
  habitDate: Date;
  initialDisplayScreen?: "main" | "reminder" | "editHabit";
}) {
  const [habitObject, setHabitObject] = useState(
    getHabitObjectFromId(habitId)!
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
          return getHabitObjectFromId(habitId)!;
        });
      }
    });

    () => {
      listener.remove();
    };
  }, []);

  return (
    <View style={styles.habitItemSheetContainer}>
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
          <ActionSheetIosOptionList
            habitItem={habitObject}
            onChangeDisplayScreen={setDisplayScreen}
            habitDate={habitDate}
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
        />
      ) : null}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    habitItemSheetContainer: {
      marginVertical: theme.spacing.s,
      // padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      backgroundColor: theme.colors.background,
    },
  });
}
