import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import CTAButton from "@/utils/components/general/CTAButton";
import AISuggestionSkeleton from "../AISuggestionSkeleton";
import { TypeAnimation } from "react-native-type-animation";

const screenWidth = Dimensions.get("window").width;

type EmotionAwareSuggestionCard = {
  habitName: string;
  completionPercentage: number;
  onViewTips?: () => void;
  onClose?: () => void;
  borderRadius?: number;
  padding?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  displayLastWeek: boolean;
};

const EmotionAwareSuggestionCard: React.FC<EmotionAwareSuggestionCard> = ({
  habitName,
  completionPercentage,
  onViewTips,
  onClose,
  borderRadius = 16,
  padding = 16,
  iconName,
  iconColor,
  displayLastWeek,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // EMOTION-AWARE SUGGESTION MESSAGE

  const [emotionAwareMessage, setEmotionAwareMessage] = useState<string | null>(
    null
  );
  const [emotionAwareMessageNumLines, setEmotionAwareMessageNumLines] =
    useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      setEmotionAwareMessage(
        "When getting too long of a message, make this say that to click more in order to view full suggestion, then open up an actionsheet. Things I should have known..."
      );
    }, 5000);
  }, []);

  const [emotionAwareMessageheight, setEmotionAwareMessageHeight] =
    useState<number>(76); // initial skeleton height
  const animatedHeight = useRef(new Animated.Value(76)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: emotionAwareMessage ? emotionAwareMessageheight : 76,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [emotionAwareMessageheight, emotionAwareMessage, animatedHeight]);

  return (
    <TouchableOpacity
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
        <Text style={styles.cardTitle}>Emotion-Aware Suggestion</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Habit name only, limited to 1 line with ellipsis */}
      <Text
        style={styles.completionText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {habitName}
      </Text>

      <Animated.View style={[styles.suggestionContainer]}>
        {emotionAwareMessage ? (
          <>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={{
                // ghost element, serves as getting the size of the actual Top AI Suggestion text, so can pre-position the Habits for Today
                opacity: 0,
                position: "absolute",
                ...styles.suggestionText,
              }}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;

                setEmotionAwareMessageHeight(height);
              }}
              onTextLayout={(event) => {
                const { lines } = event.nativeEvent;
                setEmotionAwareMessageNumLines(lines.length);

                console.log(
                  "cuz I don't play, I don't play",
                  emotionAwareMessageNumLines
                );
              }}
            >
              {emotionAwareMessage}
            </Text>
            <Animated.View
              style={{
                height: animatedHeight,
              }}
            >
              <TypeAnimation
                sequence={[{ text: emotionAwareMessage }]}
                style={{
                  ...styles.suggestionText,
                }}
                typeSpeed={1}
                cursor={Platform.OS == "ios"}
              />
            </Animated.View>
            {emotionAwareMessageNumLines > 3 ? (
              <Text>Click to view entire message</Text>
            ) : null}
          </>
        ) : (
          <AISuggestionSkeleton />
        )}
      </Animated.View>
    </TouchableOpacity>
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
    suggestionContainer: {},
  });
}

export default EmotionAwareSuggestionCard;
