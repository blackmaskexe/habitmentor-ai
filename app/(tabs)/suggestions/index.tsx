import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import AiSuggestionsTabView from "@/utils/components/specific/AiSuggestions/AiSuggestionsTabView";
import ChartCompletionsThisWeek from "@/utils/components/specific/AiSuggestions/ChartCompletionsThisWeek";
import CompletionRecommendationCard from "@/utils/components/specific/AiSuggestions/CompletionRecommendationCard";
import EmotionAwareSuggestionCard from "@/utils/components/specific/AiSuggestions/EmotionAwareSuggestionCard";
import MoodRaterCard from "@/utils/components/specific/MoodRaterCard";
import { didGetMoodCheckedToday } from "@/utils/database/dailyMetadataRecords";
import { getLeastCompletedHabitMetadataThisWeek } from "@/utils/habits/habitSuggestionsManager";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

export default function AiSuggestions() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(40)).current; // Start 40px below

  const lowestCompletedHabitThisWeek = getLeastCompletedHabitMetadataThisWeek();

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

  const [showMoodCard, setShowMoodCard] = useState(!didGetMoodCheckedToday());
  const [showNextCard, setShowNextCard] = useState(false);
  const router = useRouter();

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={styles.container}
      // contentContainerStyle={styles.scrollContent}
      // showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          marginHorizontal: theme.spacing.s,
        }}
      >
        <CardWithoutImage
          title="AI Assistant"
          onPress={() => {
            router.push("/chat");
          }}
          description="Click to chat with your AI Assistant"
          iconLetters="AI"
        />
      </View>

      <View style={styles.horizontalRoller} />

      {/* Lowest being done habit (full width card) */}
      {showMoodCard ? (
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
      ></Animated.View>

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
      {/* <AiSuggestionsTabView /> */}
      <ScrollView
        contentContainerStyle={styles.scene}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginTop: theme.spacing.s,
          }}
        />
        <CompletionRecommendationCard
          habitName={lowestCompletedHabitThisWeek.habitName}
          completionPercentage={
            lowestCompletedHabitThisWeek.completionPercentageLastWeek
          }
          habitId={lowestCompletedHabitThisWeek.habitId}
          iconName={lowestCompletedHabitThisWeek.ioniconName}
          iconColor={theme.colors.primary}
          displayLastWeek={false}
        />

        <ChartCompletionsThisWeek />

        <EmotionAwareSuggestionCard
          iconName="heart"
          iconColor={theme.colors.primary}
        />
      </ScrollView>
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
    scene: {
      // flex: 1,
      // alignItems: "center",
      // justifyContent: "center",
      backgroundColor: theme.colors.background,
      marginHorizontal: theme.spacing.s,
    },
  });
}
