import { useTheme } from "@/utils/theme/ThemeContext";
import { StyleSheet, View, Text } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

// Component imports:
import NavigationPill from "../../../general/NavigationPill";
import AppleSignInButton from "@/utils/components/general/AppleSignInButton";
import CrossButton from "@/utils/components/general/CrossButton";
import { SheetManager } from "react-native-actions-sheet";
import { useRouter } from "expo-router";

export type SuggestionsSheetPayloadData = {};

function LeaderboardSheet(props: SheetProps<"suggestions-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const payloadData: SuggestionsSheetPayloadData = props.payload;

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        backgroundColor: theme.colors.background,
      }}
      closable={false}
    >
      <View style={styles.headerContainer}>
        <NavigationPill />
        <View style={styles.crossButtonContainer}>
          <CrossButton
            outline={false}
            onPress={() => {
              router.replace("/(tabs)/home");
              SheetManager.hide("leaderboard-sheet");
            }}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Sign in to Join the Leaderboard</Text>
        <Text style={styles.descriptionText}>
          By default, only your friends can see your nickname and avatar. You
          can choose to show them on the global ranking later.
        </Text>

        <AppleSignInButton />
      </View>
    </ActionSheet>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    headerContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.s,
      marginBottom: theme.spacing.m,
    },
    crossButtonContainer: {
      position: "absolute",
      top: theme.spacing.xs,
      right: theme.spacing.m,
    },
    contentContainer: {
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.m,
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    titleText: {
      ...theme.text.h2,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    descriptionText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
  });
}

export default LeaderboardSheet;
