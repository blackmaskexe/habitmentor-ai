import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { create } from "react-test-renderer";

interface ProgressBarProps {
  currentValue: number;
  maxValue: number;
  showPercentage?: boolean; // If true, shows percentage and trims bar width
  showColoredPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentValue,
  maxValue,
  showPercentage = true,
  showColoredPercentage = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // Calculate the percentage, but cap it at 100% for the visual bar
  const percentage = Math.min((currentValue / maxValue) * 100, 100);

  // Determine if data is valid
  const isValid =
    !isNaN(percentage) && isFinite(percentage) && currentValue >= 0;

  // Determine color based on percentage
  const getBarColor = () => {
    if (!showColoredPercentage) return theme.colors.primary;
    if (percentage < 33) return "#FF3B30"; // Red for early progress
    if (percentage < 66) return "#FF9500"; // Orange for moderate progress
    return "#34C759"; // Green for nearly complete or complete
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBarContainer,
          showPercentage && styles.progressBarWithPercentage,
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${isValid ? percentage : 0}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>

      {showPercentage && (
        <Text style={styles.percentageText}>
          {isValid ? `${Math.round(percentage)}%` : "0%"}
        </Text>
      )}
    </View>
  );
};

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      height: 24,
    },
    progressBarContainer: {
      flex: 1,
      height: 8,
      backgroundColor: "#E9ECEF",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarWithPercentage: {
      flex: 0.98, // Make room for percentage text
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 4,
    },
    percentageText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      width: "15%",
      textAlign: "right",
    },
  });
}
export default ProgressBar;
