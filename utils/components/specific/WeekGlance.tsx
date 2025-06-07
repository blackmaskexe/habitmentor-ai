import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import ProgressBar from "../general/ProgressBar";
import { Theme } from "@/utils/theme/themes";
import { getDatesThisWeek } from "@/utils/date";

interface WeekAtAGlanceProps {
  // Array of percentages for each day (0-100)
  dayPercentages: number[];
  // Overall completion percentage
  completionPercentage: number;
  // Optional start date (defaults to current week)
  startDate?: Date;
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

const WeekAtAGlance: React.FC<WeekAtAGlanceProps> = ({
  dayPercentages = [0, 0, 0, 0, 0, 0, 0],
  completionPercentage = 0,
  startDate = new Date(),
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

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
                  opacity:
                    dayPercentages[index] < 40
                      ? 0.4
                      : dayPercentages[index] / 100,
                },
              ]}
            />
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Completion Percentage */}
      <ProgressBar
        currentValue={10}
        maxValue={20}
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
