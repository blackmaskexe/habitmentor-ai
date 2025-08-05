import React from "react";
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
import CTAButton from "@/utils/components/general/CTAButton";

const screenWidth = Dimensions.get("window").width;

type CompletionRecommendationCardProps = {
  habitName: string;
  completionPercentage: number;
  suggestion: string;
  onViewTips?: () => void;
  onClose?: () => void;
  borderRadius?: number;
  padding?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
};

const CompletionRecommendationCard: React.FC<
  CompletionRecommendationCardProps
> = ({
  habitName,
  completionPercentage,
  suggestion,
  onViewTips,
  onClose,
  borderRadius = 16,
  padding = 16,
  iconName,
  iconColor,
}) => {
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
        <Text style={styles.habitName}>{habitName}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Completion percentage */}
      <Text style={styles.completionText}>
        Only {completionPercentage}% completion last week
      </Text>

      {/* Suggestion text */}
      <Text style={styles.suggestionText}>{suggestion}</Text>

      {/* View Tips button using CTAButton */}
      {onViewTips && <CTAButton title="View Tips" onPress={onViewTips} />}
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
      margin: 10,
      width: "95%",
      alignSelf: "center",
      marginTop: theme.spacing.m,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    habitName: {
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
    },
    suggestionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    ctaButtonStyle: {
      marginTop: 0,
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

export default CompletionRecommendationCard;
