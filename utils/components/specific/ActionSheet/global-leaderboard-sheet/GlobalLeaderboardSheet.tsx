import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import NavigationPill from "../../../general/NavigationPill";

function GlobalLeaderboardSheet(props: SheetProps<"global-leaderboard-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const currentUser = getAuth().currentUser;

  const handleEnrollInGlobal = async () => {
    if (!currentUser) return;

    try {
      await firestore()
        .collection("users")
        .doc(currentUser.uid)
        .update({ enrolledInGlobal: true });

      // Close the sheet and let the parent component handle reloading
      SheetManager.hide("global-leaderboard-sheet");

      // Trigger a re-render of the global view by hiding and showing
      // This is a simple way to refresh the component
      setTimeout(() => {
        // The parent component will detect the change and load the leaderboard
      }, 100);
    } catch (error) {
      console.error("Error enrolling in global leaderboard:", error);
    }
  };

  const handleCancel = () => {
    SheetManager.hide("global-leaderboard-sheet");
  };

  return (
    <ActionSheet
      id={props.sheetId}
      closable={false}
      containerStyle={{
        backgroundColor: theme.colors.background,
      }}
    >
      <NavigationPill />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="globe-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.title}>Join Global Leaderboard</Text>
          <Text style={styles.subtitle}>
            Compete with users worldwide and see how you rank globally!
          </Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons
              name="eye-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.infoText}>
              Other users will see your username, avatar, and points
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.success}
            />
            <Text style={styles.infoText}>
              Your personal data and habits remain completely private
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="trophy-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.infoText}>
              Earn recognition and compete for top ranks globally
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.enrollButton]}
            onPress={handleEnrollInGlobal}
          >
            <Text style={styles.enrollButtonText}>Join Global Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      padding: theme.spacing.l,
      paddingBottom: theme.spacing.l,
    },
    header: {
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    title: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      textAlign: "center",
    },
    subtitle: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    infoSection: {
      marginBottom: theme.spacing.xl,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
      paddingHorizontal: theme.spacing.s,
    },
    infoText: {
      ...theme.text.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.m,
      flex: 1,
      lineHeight: 20,
    },
    buttonContainer: {
      gap: theme.spacing.m,
    },
    button: {
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      borderRadius: theme.radius.m,
      alignItems: "center",
    },
    enrollButton: {
      backgroundColor: theme.colors.primary,
    },
    enrollButtonText: {
      ...theme.text.body,
      color: theme.colors.background,
      fontWeight: "600",
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
  });
}

export default GlobalLeaderboardSheet;
