import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

// Component imports:
import NavigationPill from "../../../general/NavigationPill";

export type SuggestionsSheetPayloadData = {
  CustomComponent: React.ComponentType<any>;
  customProps?: Record<string, any>;
};

function SuggestionsSheet(props: SheetProps<"suggestions-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const payloadData: SuggestionsSheetPayloadData = props.payload;

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

      <payloadData.CustomComponent {...(payloadData.customProps || {})} />
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

export default SuggestionsSheet;
