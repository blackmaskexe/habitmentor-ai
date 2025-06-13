import { useTheme } from "@/utils/theme/ThemeContext";
import { Dimensions, StyleSheet } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

// Component imports:
import NavigationPill from "../../general/NavigationPill";
import HabitItemSheet from "./HabitItemSheet";

function ExampleSheet(props: SheetProps<"example-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const payloadData = props.payload;
  const sheetContentType = (payloadData.sheetType as any) || "default";

  const componentOptions: { [key: string]: any } = {
    // decide which component to render based on the sheetContentType
    // this is kind of like variant selection passed as prop
    habitItem: HabitItemSheet,
    default: null,
  };

  console.log("thugga padega tereko typeshi", payloadData);
  console.log(payloadData.habitDate, "ra ra rahahha ramma ramma aa a ullala ");
  console.log(payloadData.habitDate.getDate(), "ene lasforla");

  const SheetContentComponent = componentOptions[sheetContentType];

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.actionSheetContainer}
      // snapPoints={[200]}
      // initialSnapIndex={0}
    >
      <NavigationPill />

      <SheetContentComponent
        habitObject={payloadData.habit}
        habitDate={payloadData.habitDate}
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

export default ExampleSheet;
