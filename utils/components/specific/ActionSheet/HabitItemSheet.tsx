// habit card
// bunch of options

import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View, Text } from "react-native";
import CardWithoutImage from "../../general/CardWithoutImage";
import IosOptionList from "./ActionSheetIosOptionList";
import ReminderView from "../ReminderView";
import { useState } from "react";

// SheetManager.show("example-sheet", {
//   payload: {
//     sheetType: "habitItem",
//     habitItem: {
//       habit: habit,
//       habitIndex: index,
//     },
//   },
// });

export default function HabitItemSheet({ habitObject }: { habitObject: any }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [displayScreen, setDisplayScreen] = useState("main");

  const renderMainView = function () {
    return (
      <>
        <CardWithoutImage
          title={habitObject.habitName}
          description={habitObject.habitDescription || ""}
        />
        <IosOptionList
          habitItem={habitObject}
          onChangeDisplayScreen={setDisplayScreen}
        />
      </>
    );
  };

  const renderReminderView = function () {
    return <ReminderView onChangeDisplayScreen={setDisplayScreen} />;
  };

  return (
    <View style={styles.habitItemSheetContainer}>
      {displayScreen == "main" ? renderMainView() : null}
      {displayScreen == "reminder" ? renderReminderView() : null}
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    habitItemSheetContainer: {
      marginVertical: theme.spacing.s,
      // padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
  });
}
