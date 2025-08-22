import * as React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import CompletionRecommendationCard from "./CompletionRecommendationCard";
import EmotionAwareSuggestionCard from "./EmotionAwareSuggestionCard";
import ChartCompletionsThisWeek from "./ChartCompletionsThisWeek";
import { getLeastCompletedHabitMetadataThisWeek } from "@/utils/habits/habitSuggestionsManager";

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
        iconName={lowestCompletedHabitThisWeek.ioniconName}
        iconColor={theme.colors.primary}
        displayLastWeek={false}
      />

      <EmotionAwareSuggestionCard
        iconName="heart"
        iconColor={theme.colors.primary}
      />

      <ChartCompletionsThisWeek />
    </ScrollView>
  );
};

const SecondRoute = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.scene}>
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
      labelStyle={{ color: theme.colors.text }}
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
  });
}
