import {
  deleteHabit,
  getRemainingSkips,
  skipHabitToday,
} from "@/utils/database/habits";
import { getDate, getFormattedDate } from "@/utils/date";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { HabitObject } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";

export default function ActionSheetIosOptionList({
  habitItem,
  onChangeDisplayScreen,
  habitDate,
}: {
  habitItem: HabitObject;
  onChangeDisplayScreen: any;
  habitDate: Date;
}) {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderOptionItem = function (
    position: "top" | "between" | "bottom",
    iconName: any,
    optionName: string,
    onPress: () => void
  ) {
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          position == "top" && styles.topSettingItem,
          position == "bottom" && styles.bottomSettingItem,
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
  return (
    <ScrollView>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>OPTIONS</Text>
      </View>

      {/* Settings Group */}
      <View style={styles.settingsGroup}>
        {renderOptionItem(
          "top",
          "sparkles-outline",
          "Improve Habit using AI",
          () => {
            // router.replace("/(tabs)/home");
            SheetManager.hide("habit-sheet");
            router.navigate({
              pathname: "/chat",
              params: {
                prefilledText: `Can you help me improve and be more consistent in the habit of ${habitItem.habitName}`,
              },
            });
          }
        )}

        {renderOptionItem("bottom", "alarm-outline", "Set Reminder", () => {
          onChangeDisplayScreen("reminder");
        })}

        {getFormattedDate(habitDate) == getFormattedDate(getDate()) &&
          renderOptionItem(
            "bottom",
            "play-skip-forward-outline",
            "Skip Habit for Today",
            () => {
              if (getRemainingSkips()! > 0) {
                Alert.alert(
                  `${getRemainingSkips()} Skips left this week`,
                  "Proceeding would consume a skip",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Proceed",
                      onPress: () => skipHabitToday(habitItem.id, habitDate),
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                Alert.alert("Skips for this week exhausted");
              }
            }
          )}

        {/* {renderOptionItem("bottom", "trash-outline", "Delete Habit", () => {
          Alert.alert(
            `Delete Habit?`,
            `Are you sure you want to delete ${habitItem.habitName}?`,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  // habit deltion logic here
                  deleteHabit(habitItem.id);
                },
              },
            ],
            { cancelable: false }
          );
        })} */}

        {renderOptionItem("bottom", "create-outline", "Edit Habit", () => {
          onChangeDisplayScreen("editHabit");
        })}
        {/* {renderOptionItem(
          "bottom",
          "stats-chart-outline",
          "View Consistency Graph",
          () => {}
        )} */}

        {/* Divider */}
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
