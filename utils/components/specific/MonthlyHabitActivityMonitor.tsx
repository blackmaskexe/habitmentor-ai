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
import mmkvStorage from "@/utils/mmkvStorage";

interface DayActivity {
  date: Date;
  completionPercentage: number; // 0-100
}

export const MonthlyHabitActivityMonitor: React.FC = () => {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const [activities, setActivities] = useState<DayActivity[]>(
    Array.from({ length: daysInMonth }, () => ({
      // Use Array.from
      date: new Date(Math.random() * 212121), // Create a new Date object each time
      completionPercentage: 0,
    }))
  );

  function calculatePercentageForDay(date: Date) {
    let habitsCompleted = 0;
    let futureHabits = 0; // habits that have not yet been created, their start date is later than habitDate input
    for (const habitHistoryEntry of getHabitHistoryEntries()) {
      if (habitHistoryEntry.completionDate == getFormattedDate(date)) {
        habitsCompleted++;
      }
    }

    // finding the number of habits on that date which have not yet been created
    // doing this so we can grab ALL habits that are active on that weekday, and subtract this number
    // to get effective number of habits to be completed
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

    let appStartDate = null;
    if (mmkvStorage.getString("appStartDate")) {
      appStartDate = getDateFromFormattedDate(
        mmkvStorage.getString("appStartDate")!
      );
    } else {
      appStartDate = today;
      mmkvStorage.set("appStartDate", getFormattedDate());
    }

    setActivities((oldActivities) => {
      const newActivities = [...oldActivities];

      // if you started the app before the 1st of this month, then calculations will be done from the 1st of the month
      // otherwise, calclations will be done from the day of the month you started
      const initialDayOfMonth =
        new Date(today.getFullYear(), today.getMonth(), 1) > appStartDate
          ? 1
          : appStartDate.getDate();

      for (let i = initialDayOfMonth; i < dayToday + 1; i++) {
        console.log("kansol log", today, appStartDate, today > appStartDate);

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
