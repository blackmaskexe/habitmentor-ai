import { getLeastCompletedHabitMetadataThisWeek } from "@/utils/habits/habitSuggestionsManager";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import ChartCompletionsThisWeek from "./ChartCompletionsThisWeek";
import CompletionRecommendationCard from "./CompletionRecommendationCard";
import EmotionAwareSuggestionCard from "./EmotionAwareSuggestionCard";

const FirstRoute = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const lowestCompletedHabitThisWeek = getLeastCompletedHabitMetadataThisWeek();

  return (
    <ScrollView
      contentContainerStyle={styles.scene}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          marginTop: theme.spacing.m,
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
  );
};

const SecondRoute = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.comingSoonContainer}>
      <Text style={styles.placeholderText}>Coming Soon</Text>
    </View>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  // third: ThirdRoute,
});

export default function AiSuggestionsTabView() {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: "first", title: "Your Habits" },
    { key: "second", title: "AI-Curated Tips" },
    // { key: "third", title: "All-Time" },
  ];

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.background }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.textSecondary}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scene: {
      // flex: 1,
      // alignItems: "center",
      // justifyContent: "center",
      backgroundColor: theme.colors.background,
      marginHorizontal: theme.spacing.s,
    },
    placeholderText: {
      color: theme.colors.text,
      ...theme.text.h2,
    },
    comingSoonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
