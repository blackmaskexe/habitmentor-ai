// NOTE: THIS PAGE OPENS UP AS A MODAL

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";

import CrossButton from "@/utils/components/general/CrossButton";
import NavigationPill from "@/utils/components/general/NavigationPill";
import WeeklyHabitsView from "@/utils/components/specific/WeeklyHabitsView";
import MonthlyHabitActivityMonitor from "@/utils/components/specific/MonthlyHabitActivityMonitor";

const WeeklyScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <NavigationPill />
      <View style={styles.closeButtonContainer}>
        <CrossButton onPress={() => router.back()} size={20} outline={false} />
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerItem}>
            <Text style={styles.headerTextTop}>Habit Streak</Text>
            <Text style={styles.headerTextBottom}>21 days</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerTextTop}>Global Rank:</Text>
            <Text style={styles.headerTextBottom}>21</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerTextTop}>Total Points</Text>
            <Text style={styles.headerTextBottom}>21</Text>
          </View>
        </View>

        <View style={styles.habitCompletion}>
          <Text style={styles.monthlyProgressText}>
            Monthly Progress Chart:
          </Text>

          <TouchableOpacity>
            <MonthlyHabitActivityMonitor activities={[]} />
          </TouchableOpacity>
          <Text style={styles.monthlyProgressSubText}>
            click to view detailed consistency graph
          </Text>
          {/* <Text style={styles.weeklyTaskText}>Weekly Task Overview:</Text> */}
          {/* <WeeklyHabitsView /> */}
        </View>
      </ScrollView>
    </View>
  );
};

function createStyles(theme: any) {
  // Assuming 'theme' matches your Theme type
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.m,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      marginBottom: theme.spacing.l,
    },
    headerItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.s,
    },
    headerTextTop: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    headerTextBottom: {
      ...theme.text.h3,
      color: theme.colors.text,
      fontWeight: "600",
    },
    scrollContainer: {
      marginTop: 30, // Keep existing margin or adjust as needed
      paddingHorizontal: theme.spacing.m, // Add horizontal padding to scroll content
    },
    closeButtonContainer: {
      position: "absolute",
      top: theme.spacing.l, // Adjust positioning if needed
      right: theme.spacing.m,
      zIndex: 1, // Ensure it's above other elements
    },

    weeklyHabitsConatiner: {
      // This container wraps WeeklyHabitsView.
      // Add styles here if you need specific layout or spacing for this wrapper
      // For example, if WeeklyHabitsView itself doesn't have margins:
      // marginBottom: theme.spacing.l,
    },
    // Keep existing text style if used elsewhere, or remove if unused
    text: {
      ...theme.text.h2,
      color: theme.colors.text,
    },
    habitCompletion: {},
    monthlyProgressText: {
      color: theme.colors.text,
      ...theme.text.h2,
      marginBottom: theme.spacing.s,
    },
    monthlyProgressSubText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      ...theme.text.h4,
      marginTop: theme.spacing.xs,
    },
    weeklyTaskText: {
      marginTop: theme.spacing.xl,
      color: theme.colors.text,
      ...theme.text.h2,
    },
  });
}

export default WeeklyScreen;
