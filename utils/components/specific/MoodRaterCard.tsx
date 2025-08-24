import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { setMoodToday } from "@/utils/database/dailyMetadataRecords";

type MoodLevel = 1 | 2 | 3 | 4;

type MoodRaterCardProps = {
  value?: MoodLevel;
  onChange?: (level: MoodLevel) => void;
  borderRadius?: number;
  padding?: number;
  closeMoodCheckCard: () => any;
};

// Static emojis for the default display
const MOOD_EMOJIS: { [key in MoodLevel]: string } = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😄",
};

// NOTE: Create a folder (e.g., `src/assets/gifs`) and place your GIFs there.
// The paths below assume this structure.
const MOOD_GIFS: { [key in MoodLevel]: any } = {
  1: require("@/assets/animations/mood-rater/sad.gif"),
  2: require("@/assets/animations/mood-rater/neutral.gif"),
  3: require("@/assets/animations/mood-rater/slight_smile.gif"),
  4: require("@/assets/animations/mood-rater/happy.gif"),
};

const MOOD_STATIC_IMAGES: { [key in MoodLevel]: any } = {
  1: require("@/assets/animations/mood-rater/sad_static.png"),
  2: require("@/assets/animations/mood-rater/neutral_static.png"),
  3: require("@/assets/animations/mood-rater/slight_smile_static.png"),
  4: require("@/assets/animations/mood-rater/happy_static.png"),
};

const GIF_DURATION = 4000; // 2 seconds

const MoodRaterCard: React.FC<MoodRaterCardProps> = ({
  value,
  onChange,
  borderRadius = 16,
  padding = 16,
  closeMoodCheckCard,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // State to track which GIF is currently playing
  const [playingGif, setPlayingGif] = useState<MoodLevel | null>(null);
  // Use ReturnType<typeof setTimeout> for robust typing across environments
  const animationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, []);

  const handleEmojiPress = (level: MoodLevel) => {
    // Clear any existing animation timeout
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }

    // Trigger the parent component's change handler
    onChange?.(level);

    // Start the GIF animation
    setPlayingGif(level);

    // Set a timer to stop the animation after its duration
    animationTimeout.current = setTimeout(() => {
      setPlayingGif(null);
      animationTimeout.current = null;
    }, GIF_DURATION);

    setMoodToday(level);
    closeMoodCheckCard();
  };

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
            onPress={() => handleEmojiPress(level)}
            activeOpacity={0.8}
          >
            {playingGif === level ? (
              <Image source={MOOD_GIFS[level]} style={styles.gif} />
            ) : (
              <Image source={MOOD_STATIC_IMAGES[level]} style={styles.gif} />
            )}
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
      // minHeight: 120,
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
      paddingTop: 8,
      paddingBottom: 8, // Added for vertical centering
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
      alignItems: "center",
      justifyContent: "center",
      // Ensure the button has a fixed height to prevent layout shifts
      height: 72,
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
    },
    selectedEmoji: {
      opacity: 1,
    },
    gif: {
      width: 70,
      height: 70,
    },
  });
}

export default MoodRaterCard;
