import { isAppStartWeek } from "@/utils/date";
import {
  getAverageHabitsCompletionRatePreviousWeek,
  getAverageHabitsCompletionRateThisWeek,
} from "@/utils/habits";
import { getWeeklyHabitCompletionsCountData } from "@/utils/habits/habitSuggestionsManager";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import lodash from "lodash";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

function getChartProgressText() {
  let progressText: string;

  // seeing if the user started the app this week or not:
  if (isAppStartWeek()) {
    // if they did, give them an "introductory" message for the week
    progressText =
      "Let's try to ease into the routine of doing these habits your first week!";
  } else {
    const avgCompletionRateLastWeek =
      getAverageHabitsCompletionRatePreviousWeek();
    const avgCompletionRateThisWeek = getAverageHabitsCompletionRateThisWeek(); // this is the "so far" completion rate

    if (avgCompletionRateThisWeek == 0) {
      progressText =
        "You're at no habits completed this week. Let's get that number up!";
    } else if (avgCompletionRateLastWeek > avgCompletionRateThisWeek) {
      progressText = `${lodash.sample([
        "Oh no!",
        "Oh",
        "Look at the graph!",
      ])} You have completed ${
        avgCompletionRateLastWeek - avgCompletionRateThisWeek
      }% less habits than last week.`;
    } else {
      progressText = `${lodash.sample([
        "Good Going!",
        "Bravo!",
        "I'm amazed!",
      ])} You have completed ${
        avgCompletionRateThisWeek - avgCompletionRateLastWeek
      }% more habits than last week.`;
    }
  }

  return progressText;
}

const ChartCompletionsThisWeek = ({
  borderRadius = 16,
  padding = 16,
  iconName = "cellular",
  iconColor,
}: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius,
          padding,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconName}
          size={24}
          color={iconColor || theme.colors.primary}
        />
      </View>
      {/* Header with habit name and close button */}

      <View style={styles.header}>
        <Text style={styles.cardTitle}>Habit Completions This Week</Text>
      </View>

      {(() => {
        const raw = getWeeklyHabitCompletionsCountData();
        const labels = raw.map((d: any) => d.x);
        const values = raw.map((d: any) => d.y);

        const chartData = {
          labels,
          datasets: [{ data: values }],
        };

        const screenWidth = Dimensions.get("window").width;
        const chartWidth = screenWidth * 0.9 - padding * 2; // 0.9 because the width of the card is 90% of screen width

        const chartConfig = {
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `${theme.colors.primary}`,
          labelColor: (opacity = 1) => `${theme.colors.textSecondary}`,
          style: {
            borderRadius: 8,
          },
          propsForBackgroundLines: {
            stroke: theme.colors.border,
          },
        };

        return (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={160}
            yAxisLabel={""}
            yAxisSuffix={""}
            fromZero
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            withInnerLines={false}
            withHorizontalLabels={false}
            showValuesOnTopOfBars
            style={{
              marginVertical: 8,
              alignSelf: "center",
              paddingRight: 0,
              marginLeft: -16,
            }}
          />
        );
      })()}

      <Text style={styles.suggestionText}>{getChartProgressText()}</Text>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      margin: theme.spacing.s,
      width: "95%",
      alignSelf: "center",
      // marginTop: theme.spacing.m,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.primary,
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    completionText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
      paddingRight: theme.spacing.l,
    },
    suggestionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      // marginBottom: 16,
      lineHeight: 20,
    },
    ctaButtonStyle: {
      marginTop: 16,
    },
    iconContainer: {
      position: "absolute",
      top: 10,
      right: 10,
      borderRadius: 999, // fully rounded
      padding: 10,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0, 0.05)",
    },
  });
}

export default ChartCompletionsThisWeek;
