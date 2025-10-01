import { eraseAllHabitData } from "@/utils/habits";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import functions from "@react-native-firebase/functions";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";

const functionInstance = getFunctions();

export default function EraseData() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const renderOptionItem = function (
    position: "top" | "between" | "bottom" | "single",
    iconName: any,
    optionName: string,
    description: string,
    onPress: () => void
  ) {
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          (position == "top" || position == "single") && styles.topSettingItem,
          (position == "bottom" || position == "single") &&
            styles.bottomSettingItem,
        ]}
        onPress={() => {
          onPress();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.settingItemContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={26} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingItemText}>{optionName}</Text>
            <Text style={styles.settingItemDescription}>{description}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  const handleDeleteLocalHabits = () => {
    Alert.alert(
      "Delete Local Habits",
      "This will permanently delete all your habit data stored locally on this device. Your leaderboard profile will remain intact.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are you sure?",
              "This action cannot be undone. All your local habit data will be permanently deleted.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    // erasing all habits local data
                    router.replace("/(onboarding)");
                    await eraseAllHabitData();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleDeleteLeaderboardProfile = () => {
    Alert.alert(
      "Delete Leaderboard Profile",
      "This will permanently delete your leaderboard profile from Firebase. Your local habit data will remain intact.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are you sure?",
              "This action cannot be undone. Your leaderboard profile, friends, and all related data will be permanently deleted.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    const currentUser = getAuth().currentUser;
                    if (!currentUser) {
                      Alert.alert(
                        "Failed",
                        "You must be signed in to delete your account"
                      );
                      return;
                    }

                    const deleteUserFunction = httpsCallable(
                      functionInstance,
                      "deleteUserDataAndAccount"
                    );
                    router.replace("/(tabs)/home");
                    await deleteUserFunction();
                    signOut(getAuth());
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleDeleteBoth = () => {
    Alert.alert(
      "Delete Everything",
      "This will permanently delete ALL your data: local habits AND your leaderboard profile. This is the nuclear option.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are you absolutely sure?",
              "This action cannot be undone. ALL your data will be permanently deleted and you'll need to start over completely.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete Everything",
                  style: "destructive",
                  onPress: async () => {
                    const currentUser = getAuth().currentUser;
                    if (!currentUser) {
                      Alert.alert(
                        "Failed",
                        "You aren't logged in. Log in first"
                      );
                    }

                    // erasing all local habits
                    router.replace("/(onboarding)");
                    await eraseAllHabitData();

                    // then removing cloud data
                    const deleteUserFunction = httpsCallable(
                      functionInstance,
                      "deleteUserDataAndAccount"
                    );
                    await deleteUserFunction();
                    signOut(getAuth());
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.warningContainer}>
        <Ionicons name="warning" size={48} color={theme.colors.primary} />
        <Text style={styles.warningTitle}>Danger Zone</Text>
        <Text style={styles.warningText}>
          These actions are permanent and cannot be undone. Please choose
          carefully.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Data Deletion Options</Text>
      </View>

      <View style={styles.settingsGroup}>
        {renderOptionItem(
          "top",
          "phone-portrait",
          "Delete Local Habits Only",
          "Remove habit data from this device",
          handleDeleteLocalHabits
        )}
        {renderOptionItem(
          "between",
          "cloud",
          "Delete Leaderboard Profile Only",
          "Remove profile, friends, and cloud data",
          handleDeleteLeaderboardProfile
        )}
        {renderOptionItem(
          "bottom",
          "nuclear",
          "Delete Everything",
          "Nuclear option: delete all local and cloud data",
          handleDeleteBoth
        )}
      </View>
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    warningContainer: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 24,
    },
    warningTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    warningText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 8,
    },
    sectionHeaderText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    settingsGroup: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      marginHorizontal: 16,
      marginBottom: 32,
      shadowColor: theme.colors.shadow || theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 1,
      elevation: 1,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
    },
    topSettingItem: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    bottomSettingItem: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    settingItemContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    settingItemText: {
      fontSize: 17,
      color: theme.colors.text,
      fontWeight: "500",
    },
    settingItemDescription: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });
}
