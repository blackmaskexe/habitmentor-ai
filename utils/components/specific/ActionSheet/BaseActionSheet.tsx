import { useTheme } from "@/utils/theme/ThemeContext";
import { Dimensions, StyleSheet } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

// Component imports:
import NavigationPill from "../../general/NavigationPill";
import HabitItemSheet from "./HabitItemSheet";

const { height } = Dimensions.get("window");

function ExampleSheet(props: SheetProps<"example-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const payloadData = props.payload;
  const sheetContentType = (payloadData.sheetType as any) || "default";

  console.log("love you like i should tonight", theme.colors.primary);

  const componentOptions: { [key: string]: any } = {
    habitItem: HabitItemSheet,
  };

  const SheetContentComponent = componentOptions[sheetContentType];

  console.log("She not nice", payloadData);

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.actionSheetContainer}
      // snapPoints={[200]}
      // initialSnapIndex={0}
    >
      <NavigationPill />

      <SheetContentComponent habitObject={payloadData.habitItem.habit} />
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

export default ExampleSheet;
