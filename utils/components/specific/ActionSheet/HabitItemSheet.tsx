// habit card
// bunch of options

import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View, Text } from "react-native";
import CardWithoutImage from "../../general/CardWithoutImage";
import IosOptionList from "./ActionSheetIosOptionList";
import ReminderView from "../ReminderView";
import { useState } from "react";
import { Theme } from "@/utils/theme/themes";
import { HabitObject } from "@/utils/types";

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

  const renderMainView = function () {
    return (
      <>
        <CardWithoutImage
          title={habitObject.habitName}
          description={habitObject.habitDescription || ""}
          metadata="Reminder: 10:00 PM"
        />
        <IosOptionList
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
        habit={habitObject}
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
