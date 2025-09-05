import { useTheme } from "@/utils/theme/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

// Components:
import { Theme } from "@/utils/theme/themes";

// --- Data Structures ---
interface WeeklyHabitItem {
  id: string; // Added id for key prop
  habitName: string;
  streak: number; // Current streak for this habit
  weeklyCompleted: number; // How many times completed this week
  weeklyGoal: number; // Target frequency per week (e.g., 7 for daily)
}

// --- Dummy Data ---
const dummyWeeklyHabits: WeeklyHabitItem[] = [
  {
    id: "meditate",
    habitName: "Morning Meditation",
    streak: 12,
    weeklyCompleted: 5,
    weeklyGoal: 7,
  },
  {
    id: "water",
    habitName: "Drink Water",
    streak: 5,
    weeklyCompleted: 3,
    weeklyGoal: 7,
  },
  {
    id: "exercise",
    habitName: "Exercise",
    streak: 1, // Example of no streak
    weeklyCompleted: 2,
    weeklyGoal: 4, // Example: goal is 4 times a week
  },
  {
    id: "read",
    habitName: "Read Book",
    streak: 20,
    weeklyCompleted: 6,
    weeklyGoal: 7,
  },
];

// --- Component ---
interface WeeklyHabitsViewProps {
  habits?: WeeklyHabitItem[]; // Make optional to use dummy data
}

const WeeklyHabitsView: React.FC<WeeklyHabitsViewProps> = ({
  habits = dummyWeeklyHabits, // Use dummy data if no prop provided
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // const renderSegmentedProgressBar = (completed: number, total: number) => {
  //   return (
  //     <View style={styles.segmentedProgressContainer}>
  //       {[...Array(total)].map((_, index) => (
  //         <View
  //           key={index}
  //           style={[
  //             styles.progressSegment,
  //             index < completed && styles.progressSegmentFilled,
  //             index < total - 1 && styles.progressSegmentMargin,
  //           ]}
  //         />
  //       ))}
  //     </View>
  //   );
  // };

  return (
    <ScrollView style={styles.container}>
      {/* --- Habits List --- */}
      {/* {habits.map((habit) => ( */}
      {/* <View key={habit.id}> */}
      {/* <CardWithoutImage title={"Don't you stop"}></CardWithoutImage> */}
      {/* <Text
            style={{
              color: theme.colors.text,
              ...theme.text.h2,
            }}
          >
            I will think about it later
          </Text> */}
      {/* </View> */}
      {/* ))} */}
    </ScrollView>
  );
};

// --- Styles ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    // Header Styles
    headerContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      marginBottom: theme.spacing.m,
      // marginHorizontal: theme.spacing.m, // Add if you want horizontal margins
    },
    headerPointsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    headerPointsText: {
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.text,
    },
    headerStreaksText: {
      ...theme.text.body,
      color: theme.colors.surface,
      fontWeight: "600",
    },
    levelProgressContainer: {
      // Container for level progress text and bar
    },
    levelProgressText: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.s,
      textAlign: "center",
    },
    levelProgressBar: {
      width: "100%", // Make progress bar take full width of container
    },
    // Habit Card Styles
    habitCard: {
      backgroundColor: theme.colors.surface,
      marginVertical: theme.spacing.s,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
    habitContent: {
      width: "100%",
    },
    habitInfo: {
      marginBottom: theme.spacing.s,
    },
    habitName: {
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s / 2,
    },
    habitStreak: {
      ...theme.text.small,
      color: theme.colors.text,
      fontWeight: "500",
    },

    segmentedProgressContainer: {
      flexDirection: "row",
      width: "100%",
      height: 8,
    },
    progressSegment: {
      flex: 1,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
    },
    progressSegmentFilled: {
      backgroundColor: theme.colors.primary,
    },
    progressSegmentMargin: {
      marginRight: 4,
    },

    rightContent: {
      alignItems: "flex-end",
      width: 100, // Give the right side a fixed width for alignment
    },
    habitProgressBar: {
      width: "100%", // Make progress bar take full width of rightContent
      marginBottom: theme.spacing.s / 2,
    },
  });

export default WeeklyHabitsView;
