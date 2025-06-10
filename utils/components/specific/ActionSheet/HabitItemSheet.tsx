// habit card
// bunch of options

import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View, Text } from "react-native";
import CardWithoutImage from "../../general/CardWithoutImage";
import ReminderView from "../ReminderView";
import { useEffect, useState } from "react";
import { Theme } from "@/utils/theme/themes";
import { HabitObject } from "@/utils/types";
import ActionSheetIosOptionList from "./ActionSheetIosOptionList";
import mmkvStorage from "@/utils/mmkvStorage";
import { getHabitNotificationTime } from "@/utils/database/habits";

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
}: {
  habitObject: HabitObject;
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
        console.log(
          "sat down every party, watched you laugh and laugh again............."
        );
        console.log("giving all of my love didn't do it for you........");
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
            notificationTime
              ? "Reminder for: " + notificationTime
              : "No Reminders Set"
          }
        />
        <ActionSheetIosOptionList
          habitItem={habitObject}
          onChangeDisplayScreen={setDisplayScreen}
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
