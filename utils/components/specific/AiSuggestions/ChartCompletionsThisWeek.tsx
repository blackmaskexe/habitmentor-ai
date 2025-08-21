import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { getWeeklyHabitCompletionsCountData } from "@/utils/habits/habitSuggestionsManager";

const ChartCompletionsThisWeek = ({
  borderRadius = 16,
  padding = 16,
  iconName = "airplane",
  iconColor,
}: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius,
          padding,
        },
      ]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w && w !== containerWidth) setContainerWidth(w);
      }}
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
        const fallback = Math.min(screenWidth - 40, 520);
        const chartWidth = containerWidth
          ? Math.max(200, containerWidth - 8)
          : fallback;

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
              paddingRight: theme.spacing.m,
              paddingLeft: theme.spacing.m,
            }}
          />
        );
      })()}

      <Text style={styles.suggestionText}>
        Oh no! You completed 23% less habits than last time
      </Text>
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
      backgroundColor: "rgba(0,0,0, 0.1)",
    },
  });
}

export default ChartCompletionsThisWeek;
