import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import {
  Canvas,
  Group,
  Skottie,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import { useDerivedValue, runOnJS } from "react-native-reanimated";

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

// Minimal Skottie-compatible animation (a simple circle morph)
const minimalSkottieJSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Minimal Circle",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shape Layer 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.667, 0.667], y: [1, 1] },
                o: { x: [0.333, 0.333], y: [0, 0] },
                t: 0,
                s: [60, 60],
              },
              { t: 60, s: [30, 30] },
            ],
          },
          nm: "Ellipse Path 1",
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.6, 0.9, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          nm: "Fill 1",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

const MOOD_ANIMATIONS: { [key in MoodLevel]: any } = {
  1: minimalSkottieJSON,
  2: minimalSkottieJSON,
  3: minimalSkottieJSON,
  4: minimalSkottieJSON,
};

const MoodRaterCard: React.FC<MoodRaterCardProps> = ({
  value,
  onChange,
  borderRadius = 16,
  padding = 16,
}) => {
  const moodSkottie = React.useMemo(
    () => ({
      1: Skia.Skottie.Make(JSON.stringify(MOOD_ANIMATIONS[1])),
      2: Skia.Skottie.Make(JSON.stringify(MOOD_ANIMATIONS[2])),
      3: Skia.Skottie.Make(JSON.stringify(MOOD_ANIMATIONS[3])),
      4: Skia.Skottie.Make(JSON.stringify(MOOD_ANIMATIONS[4])),
    }),
    []
  );

  // Debug: log if Skottie animations are valid
  React.useEffect(() => {
    console.log("Skottie valid?", {
      1: moodSkottie[1] !== null,
      2: moodSkottie[2] !== null,
      3: moodSkottie[3] !== null,
      4: moodSkottie[4] !== null,
    });
  }, [moodSkottie]);

  const theme = useTheme();
  const styles = createStyles(theme);

  const [currentlyAnimating, setCurrentlyAnimating] = React.useState<MoodLevel | null>(null);
  const [animationStart, setAnimationStart] = React.useState<number>(0);
  const clock = useClock();

  // When an emoji is pressed, start animation from frame 0
  const startAnimation = (level: MoodLevel) => {
    setCurrentlyAnimating(level);
    setAnimationStart(Date.now());
  };

  // Calculate frame for Skottie using Reanimated, following Skia docs
  const frame = useDerivedValue(() => {
    if (!currentlyAnimating || !moodSkottie[currentlyAnimating]) return 0;
    const animation = moodSkottie[currentlyAnimating];
    const fps = animation.fps();
    const duration = animation.duration();
    const maxFrame = duration * fps;
    // Calculate elapsed time since animation started
    const elapsed = (clock.value - animationStart) / 1000;
    let currentFrame = Math.floor(elapsed * fps);
    if (currentFrame >= maxFrame) {
      // Animation finished, reset
      runOnJS(setCurrentlyAnimating)(null);
      return maxFrame - 1;
    }
    return currentFrame;
  }, [currentlyAnimating, moodSkottie, clock, animationStart]);

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
            onPress={() => {
              startAnimation(level);
              onChange?.(level);
            }}
            activeOpacity={0.8}
          >
            {currentlyAnimating === level && moodSkottie[level] !== null ? (
              <Canvas style={{ width: 60, height: 60 }}>
                <Group>
                  <Skottie animation={moodSkottie[level]} frame={frame} />
                </Group>
              </Canvas>
            ) : (
              <Text
                style={[styles.emoji, value === level && styles.selectedEmoji]}
              >
                {MOOD_EMOJIS[level]}
              </Text>
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
