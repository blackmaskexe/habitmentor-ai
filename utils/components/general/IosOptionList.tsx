import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";

export default function IosOptionList({ habitItem }: { habitItem: any }) {
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
            <Ionicons name={iconName} size={22} color={theme.colors.primary} />
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
            SheetManager.hide("example-sheet");
            router.navigate({
              pathname: "/(tabs)/chat",
              params: {
                initialMessage: `Can you help me improve and be more consistent in the habit of ${habitItem.habitName}`,
              },
            });
          }
        )}

        {renderOptionItem(
          "between",
          "stats-chart-outline",
          "View Consistency Graph",
          () => {}
        )}
        {renderOptionItem(
          "bottom",
          "play-skip-forward-outline",
          "Skip Task for Today",
          () => {}
        )}

        {/* Divider */}
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

function createStyles(theme: any) {
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
    spacer: {
      height: 40,
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
      color: theme.colors.onPrimary || theme.colors.white, // Replaced "white", assuming onPrimary or a white color exists
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
