import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import { Theme } from "@/utils/theme/themes";
import { useRouter } from "expo-router";
import CompletionRecommendationCard from "@/utils/components/specific/CompletionRecommendationCard";
import MoodRaterCard from "@/utils/components/specific/MoodRaterCard";

export default function AiSuggestions() {
  const router = useRouter();

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
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
      <MoodRaterCard />
      <CompletionRecommendationCard
        habitName="Dance"
        completionPercentage={25}
        suggestion="do sum shi idk"
        iconName="airplane"
        iconColor={theme.colors.primary}
      />
    </ScrollView>
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
