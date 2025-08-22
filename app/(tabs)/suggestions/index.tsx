import React, { useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import { Theme } from "@/utils/theme/themes";
import { useRouter } from "expo-router";
import CompletionRecommendationCard from "@/utils/components/specific/AiSuggestions/CompletionRecommendationCard";
import MoodRaterCard from "@/utils/components/specific/MoodRaterCard";
import { didGetMoodCheckedToday } from "@/utils/database/dailyMetadataRecords";
import Card from "@/utils/components/general/Card";
import CardGrid2x1 from "@/utils/components/general/CardGrid2x1";
import { getLeastCompletedHabitMetadataThisWeek } from "@/utils/habits/habitSuggestionsManager";
import ChartCompletionsThisWeek from "@/utils/components/specific/AiSuggestions/ChartCompletionsThisWeek";
import EmotionAwareSuggestionCard from "@/utils/components/specific/AiSuggestions/EmotionAwareSuggestionCard";
import AiSuggestionsTabView from "@/utils/components/specific/AiSuggestions/AiSuggestionsTabView";

export default function AiSuggestions() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(40)).current; // Start 40px below

  const handleCloseMoodCard = () => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        // easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setShowMoodCard(false);
        setShowNextCard(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          // easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      });
    }, 1500);
  };

  const [showMoodCard, setShowMoodCard] = useState(didGetMoodCheckedToday());
  const [showNextCard, setShowNextCard] = useState(false);
  const router = useRouter();

  const theme = useTheme();
  const styles = createStyles(theme);

  const lowestCompletedHabitThisWeek = getLeastCompletedHabitMetadataThisWeek();

  return (
    <View
      style={styles.container}
      // contentContainerStyle={styles.scrollContent}
      // showsVerticalScrollIndicator={false}
    >
      <CardWithoutImage
        title="AI Assistant"
        onPress={() => {
          router.push("/chat");
        }}
        description="Click to chat with your AI Assistant"
        iconLetters="AI"
      />
      <View style={styles.horizontalRoller} />

      {/* Lowest being done habit (full width card) */}
      {/* {showMoodCard ? (
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
        >
          <MoodRaterCard closeMoodCheckCard={handleCloseMoodCard} />
        </Animated.View>
      ) : null}

      <Animated.View
        style={{
          transform: [
            {
              translateY: showMoodCard
                ? 40 // keep it below while MoodRaterCard is visible
                : slideAnim,
            },
          ],
          opacity: showMoodCard ? 0 : 1, // hide until MoodRaterCard is gone
        }}
      ></Animated.View> */}

      {/* <CompletionRecommendationCard
        habitName={lowestCompletedHabitThisWeek.habitName}
        completionPercentage={
          lowestCompletedHabitThisWeek.completionPercentageLastWeek
        }
        iconName={lowestCompletedHabitThisWeek.ioniconName}
        iconColor={theme.colors.primary}
        displayLastWeek={false}
      />

      <EmotionAwareSuggestionCard
        iconName="heart"
        iconColor={theme.colors.primary}
      />

      <ChartCompletionsThisWeek /> */}
      <AiSuggestionsTabView />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.m,
    },
    horizontalRoller: {
      width: "90%",
      height: 1,
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.s,
      alignSelf: "center",
      borderRadius: 8,
    },
  });
}
