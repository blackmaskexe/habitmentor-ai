import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";

type MoodLevel = 1 | 2 | 3 | 4;

type MoodRaterCardProps = {
  value?: MoodLevel;
  onChange?: (level: MoodLevel) => void;
  borderRadius?: number;
  padding?: number;
};

const MOOD_EMOJIS: { [key in MoodLevel]: string } = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😄",
};

const MoodRaterCard: React.FC<MoodRaterCardProps> = ({
  value,
  onChange,
  borderRadius = 16,
  padding = 16,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, { borderRadius, padding }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Mood Check</Text>
      </View>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.emojiRow}>
        {([1, 2, 3, 4] as MoodLevel[]).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.emojiButton,
              { width: "23%" },
              value === level && styles.selectedEmojiButton,
            ]}
            onPress={() => onChange?.(level)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.emoji, value === level && styles.selectedEmoji]}
            >
              {MOOD_EMOJIS[level]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      margin: 10,
      width: "95%",
      alignSelf: "center",
      marginTop: theme.spacing.m,
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: 120,
      //   paddingVertical: 18,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 2,
    },
    headerText: {
      color: theme.colors.primary,
      fontWeight: "700",
      fontSize: 16,
      marginLeft: 2,
    },
    iconCircle: {
      backgroundColor: theme.colors.text + "10",
      borderRadius: 999,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 2,
    },
    title: {
      fontSize: 18,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 8,
      textAlign: "left",
      letterSpacing: 0.2,
      marginTop: 2,
      marginLeft: 2,
    },
    emojiRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      alignSelf: "center",
      marginTop: 2,
      paddingHorizontal: 8,
    },
    emojiButton: {
      //   paddingVertical: 18,
      paddingTop: 8,
      paddingHorizontal: 0,
      borderRadius: 999,
      marginHorizontal: 2,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: "transparent",
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
      transitionDuration: "150ms",
      alignItems: "center",
      justifyContent: "center",
    },
    selectedEmojiButton: {
      backgroundColor: theme.colors.primary + "22",
      borderColor: theme.colors.primary,
      borderWidth: 1.5,
      shadowOpacity: 0.15,
      elevation: 2,
    },
    emoji: {
      fontSize: 48,
      opacity: 0.85,
      transitionDuration: "150ms",
    },
    selectedEmoji: {
      fontSize: 48,
      opacity: 1,
    },
  });
}

export default MoodRaterCard;
