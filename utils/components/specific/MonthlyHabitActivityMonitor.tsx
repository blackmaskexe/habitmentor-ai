import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";

interface DayActivity {
  date: Date;
  completionPercentage: number; // 0-100
}

interface MonthlyHabitActivityMonitorProps {
  activities: DayActivity[];
}

export const MonthlyHabitActivityMonitor: React.FC<
  MonthlyHabitActivityMonitorProps
> = ({ activities }) => {
  const dummyActivities: DayActivity[] = Array.from(
    { length: 30 },
    (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index)); // This will give last 30 days

      return {
        date: date,
        completionPercentage: Math.floor(Math.random() * 100), // Random percentage between 0-100
      };
    }
  );
  activities = dummyActivities;
  const theme = useTheme();
  const styles = createStyles(theme);

  const getOpacityForCompletion = (percentage: number) => {
    if (percentage === 0) return 0.1;
    if (percentage < 25) return 0.3;
    if (percentage < 50) return 0.5;
    if (percentage < 75) return 0.7;
    return 1;
  };

  const renderActivityBoxes = () => {
    return activities.map((activity, _) => (
      <View
        key={activity.date.toISOString()}
        style={[
          styles.activityBox,
          {
            backgroundColor: theme.colors.primary,
            opacity: getOpacityForCompletion(activity.completionPercentage),
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>{renderActivityBoxes()}</View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.m,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      justifyContent: "flex-start",
    },
    activityBox: {
      width: 32,
      height: 32,
      borderRadius: theme.radius.s,
      backgroundColor: theme.colors.primary,
    },
  });

export default MonthlyHabitActivityMonitor;
