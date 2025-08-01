import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import ProgressBar from "../general/ProgressBar";
import { Theme } from "@/utils/theme/themes";
import {
  getDate,
  getDateFromFormattedDate,
  getDatesThisWeek,
  getFormattedDate,
  getFormattedDatesThisWeek,
  getWeekdayNumber,
} from "@/utils/date";
import { getHabitHistoryEntries } from "@/utils/database/habitHistoryManager";
import {
  getAllHabitsOnWeekday,
  getTotalHabitNumberOnDay,
} from "@/utils/database/habits";
import mmkvStorage from "@/utils/mmkvStorage";

interface WeekAtAGlanceProps {
  // Array of percentages for each day (0-100)
  // dayPercentages: number[];
  // Overall completion percentage
  // completionPercentage: number;
  // Optional start date (defaults to current week)
  // startDate?: Date;
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WeekAtAGlance: React.FC<WeekAtAGlanceProps> = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [dayPercentages, setDayPercentages] = useState<number[]>([]);
  // function calculatePercentageForDay(date: Date) {
  //   let habitsCompleted = 0;
  //   let futureHabits = 0; // habits that have not yet been started, their start date is later than habitDate input
  //   for (const habitHistoryEntry of getHabitHistoryEntries()) {
  //     if (habitHistoryEntry.completionDate == getFormattedDate(date)) {
  //       habitsCompleted++;
  //     }
  //   }

  //   for (const habit of getAllHabitsOnWeekday(getWeekdayNumber(date))) {
  //     if (getDate() < getDateFromFormattedDate(habit.startDate!)) {
  //       futureHabits++;
  //     }
  //   }

  //   const effectiveTotalHabits =
  //     getTotalHabitNumberOnDay(getWeekdayNumber(date)) - futureHabits;

  //   return (habitsCompleted / effectiveTotalHabits) * 100;
  // }
  useEffect(() => {
    function calculateAndSetDayPercentages() {
      const formattedWeekDayArray = getFormattedDatesThisWeek();
      const newDayPercentages = formattedWeekDayArray.map(
        (weekdayFormattedDate, weekdayIndex) => {
          let habitsCompleted = 0;
          let futureHabits = 0; // habits that have not yet been created, their start date is later than habitDate input

          for (const habitHistoryEntry of getHabitHistoryEntries()) {
            if (habitHistoryEntry.completionDate == weekdayFormattedDate) {
              habitsCompleted++;
            }
          }

          for (const habit of getAllHabitsOnWeekday(weekdayIndex)) {
            if (getDate() < getDateFromFormattedDate(habit.startDate!)) {
              futureHabits++;
            }
          }

          const effectiveHabitsCompleted = habitsCompleted + futureHabits;

          // if the app wasn't downloaded on this day, just return a 0 percentage:
          let appStartDate = null;
          if (mmkvStorage.getString("appStartDate")) {
            appStartDate = getDateFromFormattedDate(
              mmkvStorage.getString("appStartDate")!
            );
          } else {
            mmkvStorage.set("appStartDate", getFormattedDate());
            appStartDate = getDate();
          }

          if (getTotalHabitNumberOnDay(weekdayIndex) == 0) {
            // if there are no habits that are to be done on this day, then
            // return 0 opacity
            return 0;
          } else if (
            getDateFromFormattedDate(weekdayFormattedDate) < appStartDate
          ) {
            return 0;
          } else {
            // if it was downloaded before this day, set a legit day percentage
            return (
              (effectiveHabitsCompleted /
                getTotalHabitNumberOnDay(weekdayIndex)) *
              100
            );
          }
        }
      );

      setDayPercentages(newDayPercentages);
    }

    // calculate percentages on mount:
    calculateAndSetDayPercentages();

    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "habitHistory" || changedKey == "activeHabits") {
        // re-run calculation of percentages if user does any habits + new habits are added to the system:
        calculateAndSetDayPercentages();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  // Calculate the date range for the week
  const getDateRange = (): string => {
    const weekDateArray = getDatesThisWeek();
    const weekStart = weekDateArray[0];
    const weekEnd = weekDateArray[6];

    const formatDate = (d: Date) => {
      return `${monthLabels[d.getMonth()]} ${d.getDate()}`;
    };

    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };

  const calculateOpacity: any = (percent: number) => {
    if (percent < 20) return 0.2;
    if (percent < 40) return 0.4;
    if (percent < 60) return 0.6;
    if (percent < 80) return 0.8;
    return 1;
  };

  // Day labels
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Weekly Completion Progress</Text>
        <Text style={styles.dateRange}>{getDateRange()}</Text>
      </View>

      {/* Days Grid */}
      <View style={styles.daysContainer}>
        {dayLabels.map((day, index) => (
          <View key={index} style={styles.dayWrapper}>
            <View
              style={[
                styles.daySquare,
                {
                  opacity: calculateOpacity(dayPercentages[index]),
                },
              ]}
            />
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Completion Percentage */}
      <ProgressBar
        currentValue={
          dayPercentages.reduce((sum, value) => sum + value, 0) /
          dayPercentages.length
        }
        maxValue={100}
        showColoredPercentage={false}
      />
    </View>
  );
};
function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      position: "relative",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },
    // ...existing styles...
    dayWrapper: {
      width: 36,
      height: 36,
      margin: 4,
      position: "relative",
    },
    daySquare: {
      width: "100%",
      height: "100%",
      borderRadius: 4, // explicit small value instead of theme.radius.xs
      position: "absolute",
      backgroundColor: theme.colors.primary,
    },
    dayLabel: {
      ...theme.text.small,
      position: "absolute",
      width: "100%",
      height: "100%",
      textAlign: "center",
      textAlignVertical: "center",
      lineHeight: 36,
      fontWeight: "600",
      color: theme.colors.text,
      zIndex: 1,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // marginBottom: theme.spacing.s,
    },
    headerText: {
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.text,
    },
    dateRange: {
      ...theme.text.small,
      color: theme.colors.text,
    },
    daysContainer: {
      flexDirection: "row",
      justifyContent: "flex-start", // Changed from space-between
      marginVertical: theme.spacing.m,
      width: "75%", // This reserves space for completion text
    },

    completionText: {
      position: "absolute",
      bottom: theme.spacing.s,
      right: theme.spacing.m,
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
  });
}

export default WeekAtAGlance;
