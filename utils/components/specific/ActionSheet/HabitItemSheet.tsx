// habit card
// bunch of options

import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View, Text } from "react-native";
import CardWithoutImage from "../../general/CardWithoutImage";
import ReminderView from "../ReminderView";
import { useCallback, useEffect, useState } from "react";
import { Theme } from "@/utils/theme/themes";
import { HabitObject } from "@/utils/types";
import ActionSheetIosOptionList from "./ActionSheetIosOptionList";
import mmkvStorage from "@/utils/mmkvStorage";
import { getHabitNotificationTime } from "@/utils/database/habits";
import { useFocusEffect } from "expo-router";

// SheetManager.show("example-sheet", {
//   payload: {
//     sheetType: "habitItem",
//     habitItem: {
//       habit: habit,
//       habitIndex: index,
//     },
//   },
// });

export default function HabitItemSheet({
  habitObject,
  habitDate,
}: {
  habitObject: HabitObject;
  habitDate: Date;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [displayScreen, setDisplayScreen] = useState("main");
  const [notificationTime, setNotificationTime] = useState<string | undefined>(
    getHabitNotificationTime(habitObject.id)
  );

  useEffect(() => {
    // run on mount, detect changes to activeHabits (if reminder changed, should populate again)
    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "activeHabits") {
        setNotificationTime(getHabitNotificationTime(habitObject.id));
      }
    });

    () => {
      listener.remove();
    };
  }, []);

  const renderMainView = function () {
    return (
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
    );
  };

  const renderReminderView = function () {
    return (
      <ReminderView
        onChangeDisplayScreen={setDisplayScreen}
        habitId={habitObject.id}
      />
    );
  };

  return (
    <View style={styles.habitItemSheetContainer}>
      {displayScreen == "main" ? renderMainView() : null}
      {displayScreen == "reminder" ? renderReminderView() : null}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    habitItemSheetContainer: {
      marginVertical: theme.spacing.s,
      // padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
  });
}
