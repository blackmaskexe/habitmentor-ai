import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { getHabitHistoryEntries } from "@/utils/database/habitHistoryManager";
import {
  getDate,
  getDateFromFormattedDate,
  getFormattedDate,
  getWeekdayNumber,
} from "@/utils/date";
import {
  getAllHabits,
  getAllHabitsOnWeekday,
  getTotalHabitNumberOnDay,
} from "@/utils/database/habits";

interface DayActivity {
  date: Date;
  completionPercentage: number; // 0-100
}

export const MonthlyHabitActivityMonitor: React.FC = () => {
  const [activities, setActivities] = useState<DayActivity[]>(
    Array.from({ length: 30 }, () => ({
      // Use Array.from
      date: new Date(Math.random() * 1000000), // Create a new Date object each time
      completionPercentage: 0,
    }))
  );

  function calculatePercentageForDay(date: Date) {
    let habitsCompleted = 0;
    let futureHabits = 0; // habits that have not yet been started, their start date is later than habitDate input
    for (const habitHistoryEntry of getHabitHistoryEntries()) {
      if (habitHistoryEntry.completionDate == getFormattedDate(date)) {
        habitsCompleted++;
      }
    }

    for (const habit of getAllHabitsOnWeekday(getWeekdayNumber(date))) {
      if (getDate() < getDateFromFormattedDate(habit.startDate!)) {
        futureHabits++;
      }
    }

    const effectiveTotalHabits =
      getTotalHabitNumberOnDay(getWeekdayNumber(date)) - futureHabits;

    return (habitsCompleted / effectiveTotalHabits) * 100;
  }

  useEffect(() => {
    // calculate completion percentages (content of activities state) on mount
    const today = getDate();
    const dayToday = today.getDate();

    setActivities((oldActivities) => {
      const newActivities = [...oldActivities];
      for (let i = 1; i < dayToday + 1; i++) {
        // looping for days of month until today
        const dateThisDay = new Date(today.getFullYear(), today.getMonth(), i);
        newActivities[i - 1] = {
          date: dateThisDay, // ith day of the month
          completionPercentage: calculatePercentageForDay(dateThisDay),
        };
      }

      return newActivities;
    });
  }, []);

  const theme = useTheme();
  const styles = createStyles(theme);

  const getOpacityForCompletion: any = (percent: number) => {
    if (percent < 20) return 0.2;
    if (percent < 40) return 0.4;
    if (percent < 60) return 0.6;
    if (percent < 80) return 0.8;
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
