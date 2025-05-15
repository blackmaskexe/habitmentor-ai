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

export default function FrequencyPickerOptionList() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

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
          position == "top" && styles.topSettingItem,
          position == "bottom" && styles.bottomSettingItem,
          position == "single" && [
            styles.topSettingItem,
            styles.bottomSettingItem,
          ],
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
        <Text style={styles.sectionHeaderText}>Set Task Frequency</Text>
      </View>

      {/* Settings Group */}
      <View style={styles.settingsGroup}>
        {renderOptionItem(
          "single",
          "calendar-outline",
          "Set Habit Frequency",
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
      //   paddingHorizontal: theme.spacing.m,
      paddingBottom: theme.spacing.s,
    },
    sectionHeaderText: {
      ...theme.text.body,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    settingsGroup: {
      backgroundColor: theme.colors.input, // Form field background
      borderRadius: theme.radius.m, // Form field radius
      //   marginHorizontal: theme.spacing.m,
      borderWidth: 1, // Form field border
      borderColor: theme.colors.border, // Form field border color
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      backgroundColor: theme.colors.input, // Form field background
    },
    // Add new styles for top and bottom items
    topSettingItem: {
      borderTopLeftRadius: theme.radius.m, // Form field radius
      borderTopRightRadius: theme.radius.m, // Form field radius
    },
    bottomSettingItem: {
      borderBottomLeftRadius: theme.radius.m, // Form field radius
      borderBottomRightRadius: theme.radius.m, // Form field radius
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
      marginRight: theme.spacing.m,
    },
    settingItemText: {
      ...theme.text.body,
      fontSize: 17,
      color: theme.colors.text, // Form field text color
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border, // Form field border color
      marginLeft: 56, // Align with text start
      opacity: 0.5,
    },
  });
}
