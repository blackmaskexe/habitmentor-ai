import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications } from "@/utils/useNotifications";
import {
  eraseAllHabitData,
  getAllHabits,
  getHabitObjectFromId,
  resetAllHabitNotifications,
} from "@/utils/habits";
import { useFocusEffect, useRouter } from "expo-router";
import ToggleSwitch from "@/utils/components/general/ToggleSwitch";
import mmkvStorage from "@/utils/mmkvStorage";
import AIToneSelectionDropdownMenu from "@/utils/components/specific/zeego/AIToneSelectionDropdownMenu";
import { useCallback, useState } from "react";
import { getDateFromFormattedTime } from "@/utils/date";
import { getAuth, signOut } from "@react-native-firebase/auth";

export default function Settings() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const { schedulePushNotification } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      // calculate the status of notification on each open of the settings tab
      setNotificationsEnabled(() => {
        const isNotificationOn = mmkvStorage.getBoolean("isNotificationOn");
        // handling case when mmkv is undefined (unliekly, set to true during onboarding)
        if (isNotificationOn == undefined) {
          mmkvStorage.set("isNotificationOn", true);
          return true;
        }
        // set the state mimicking mmkvstorage
        if (isNotificationOn) {
          return true;
        } else {
          return false;
        }
      });
    }, [])
  );

  const { cancelAllScheduledNotifications } = useNotifications();

  const renderOptionItem = function (
    position: "top" | "between" | "bottom" | "single",
    iconName: any,
    optionName: string,
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
          <Text style={styles.settingItemText}>{optionName}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  const renderOptionToggleItem = function (
    position: "top" | "between" | "bottom",
    iconName: any,
    optionName: string,
    onToggle: (isSwitchedOn: boolean) => void,
    initialState: boolean,
    currentState?: boolean
  ) {
    return (
      <View
        style={[
          styles.settingItem,
          position == "top" && styles.topSettingItem,
          position == "bottom" && styles.bottomSettingItem,
        ]}
      >
        <View style={styles.settingItemContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={26} color={theme.colors.primary} />
          </View>
          <Text style={styles.settingItemText}>{optionName}</Text>
        </View>
        <ToggleSwitch
          initialState={initialState}
          onToggle={onToggle}
          currentState={currentState != undefined ? currentState : undefined}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Habit Notifications</Text>
      </View>

      {/* Settings Group */}
      <View style={styles.settingsGroup}>
        {renderOptionToggleItem(
          "top",
          "alarm",
          "Enable Reminder Notifications",
          (isEnabled) => {
            if (isEnabled) {
              mmkvStorage.set("isNotificationOn", true);
              setNotificationsEnabled(true);

              // re-scheduling all the notifications that previously were scheduled (those with something in their notificationIds key)
              for (const habit of getAllHabits()) {
                if (habit.notificationIds && habit.notificationTime) {
                  schedulePushNotification(
                    getDateFromFormattedTime(habit.notificationTime),
                    getHabitObjectFromId(habit.id)!
                  );
                }
              }
            } else {
              mmkvStorage.set("isNotificationOn", false);
              setNotificationsEnabled(false);
              // clearing out the notificationTime and notificationIds from mmkv of the habit:
              resetAllHabitNotifications();
              // clear all notifications (that's all it does, to renable the user will have to set the things manually)
              cancelAllScheduledNotifications();
            }
          },
          notificationsEnabled,
          notificationsEnabled
        )}
        {renderOptionItem("bottom", "close", "Cancel All Notifications", () => {
          Alert.alert(
            `Cancel all Notification?`,
            "Are you sure?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  cancelAllScheduledNotifications();
                  resetAllHabitNotifications();
                },
              },
            ],
            { cancelable: false }
          );
        })}

        {/* Divider */}
        <View style={styles.divider} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Leaderboard Settings</Text>
      </View>

      {/* Leaderboard Group */}
      <View style={styles.settingsGroup}>
        {renderOptionItem("top", "log-out", "Log Out", async () => {
          Alert.alert(
            `Logging Out`,
            "You will have to log back in to use leaderboards",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: async () => {
                  await signOut(getAuth());
                  console.log("User Signed Out Successfully!");
                },
              },
            ],
            { cancelable: false }
          );
        })}

        {/* Divider */}
        <View style={styles.divider} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Danger Zone</Text>
      </View>

      {/* Settings Group */}
      <View style={styles.settingsGroup}>
        {renderOptionItem("single", "trash", "Erase All Data", async () => {
          Alert.alert(
            `Erase all Habit Data?`,
            "Are you sure?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: async () => {
                  router.replace("/(onboarding)");
                  await eraseAllHabitData();
                },
              },
            ],
            { cancelable: false }
          );
        })}

        {/* Divider */}
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingTop: 30,
      paddingBottom: 8,
    },
    sectionHeaderText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary, // Replaced "#8E8E93"
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    settingsGroup: {
      backgroundColor: theme.colors.surface, // Replaced "white"
      borderRadius: 10,
      marginHorizontal: 16,
      shadowColor: theme.colors.shadow || theme.colors.text, // Replaced "#000"
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 1,
      elevation: 1,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface, // Replaced "#ffffff"
    },
    // Add new styles for top and bottom items
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
    },
    iconContainer: {
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingItemText: {
      fontSize: 17,
      color: theme.colors.text, // Replaced "#000"
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.border, // Replaced "#C7C7CC"
      marginLeft: 56, // Align with text start
      opacity: 0.5,
    },
    signOutButton: {
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.primary, // Replaced "#007AFF"
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginHorizontal: 16,
    },
    signOutText: {
      color: theme.colors.primary || theme.colors.textSecondary, // Replaced "white", assuming onPrimary or a white color exists
      fontSize: 16,
      fontWeight: "600",
    },
    versionText: {
      textAlign: "center",
      fontSize: 12,
      color: theme.colors.textSecondary, // Replaced "#8E8E93"
      marginTop: 20,
      marginBottom: 24,
    },
  });
}
