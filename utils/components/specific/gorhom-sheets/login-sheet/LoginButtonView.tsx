import AppleSignInButton from "@/utils/components/general/AppleSignInButton";
import GoogleSignInButtonIos from "@/utils/components/general/GoogleSigninButtonIos";
import GoogleSignInButtonAndroid from "@/utils/components/general/GoogleSigninButtonAndroid";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function LoginButtonView() {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.titleText}>Sign in to Join the Leaderboard</Text>
      <Text style={styles.descriptionText}>
        By default, only your friends can see your nickname and avatar. You can
        choose to show them on the global ranking later.
      </Text>

      <AppleSignInButton />
      {Platform.OS == "ios" ? <GoogleSignInButtonIos /> : null}
      {Platform.OS == "android" ? <GoogleSignInButtonAndroid /> : null}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
