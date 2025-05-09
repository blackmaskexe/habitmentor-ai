// habit card
// bunch of options

import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View } from "react-native";
import CardWithoutImage from "../../general/CardWithoutImage";

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
  console.log("Why does it", theme);

  return (
    <View style={styles.habitItemSheetContainer}>
      <CardWithoutImage
        title={habitObject.habitName}
        description="Splish splash like the past she's the wave tuturned"
      />
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    habitItemSheetContainer: {
      marginVertical: theme.spacing.s,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
    habitCard: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      //   backgroundColor: theme.colors.surface,
      //   marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
    habitInfo: {
      flex: 1,
      color: theme.colors.textSecondary,
    },
    habitName: {
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s / 2,
    },
    habitOptions: {
      alignSelf: "center",
    },
    habitDeadline: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
    },
    habitTextContainer: {
      marginLeft: 16,
    },
    checkmarksRow: {
      flexDirection: "row",
      marginBottom: theme.spacing.s / 2,
    },
    checkmarkContainer: {
      marginLeft: theme.spacing.s,
    },
    points: {
      ...theme.text.small,
      color: theme.colors.textTertiary,
    },
  });
}
