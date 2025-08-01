import { useTheme } from "@/utils/theme/ThemeContext";
import { Dimensions, StyleSheet } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

// Component imports:
import NavigationPill from "../../general/NavigationPill";
import HabitItemSheet from "./HabitItemSheet";

function HabitSheet(props: SheetProps<"habit-sheet">) {

  const theme = useTheme();
  const styles = createStyles(theme);

  const payloadData = props.payload;

  return (
    <ActionSheet
      id={props.sheetId}
      // snapPoints={[200]}
      // initialSnapIndex={0}
      containerStyle={{
        backgroundColor: theme.colors.background,
      }}
    >
      <NavigationPill />

      <HabitItemSheet
        habitId={payloadData.habit.id}
        habitDate={payloadData.habitDate}
        initialDisplayScreen={
          payloadData.initialDisplayScreen
            ? payloadData.initialDisplayScreen
            : "main"
        }
      />
    </ActionSheet>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    actionSheetContainer: {
      backgroundColor: theme.colors.background,
    },
  });
}

export default HabitSheet;
