import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";

import WeekAtAGlance from "@/utils/components/specific/WeekGlance";
import DailyHabitsView from "@/utils/components/specific/DailyHabitsView";

export default function Index() {
  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <Text style={styles.headerText}>Total Points:</Text>
        <Text style={styles.headerText}>Streak:</Text> */}
      </View>
      <ScrollView
        style={{
          width: "90%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <WeekAtAGlance
          dayPercentages={[90, 20, 50, 60, 70, 10, 100]}
          completionPercentage={99}
        />
        <View style={styles.habitsSection}>
          <Text style={styles.habitSectionText}>Habits for Today:</Text>
          <DailyHabitsView />
        </View>
        {/* <View style={styles.habitsSection}>
          <Text style={styles.habitSectionText}>Upcoming Milestones:</Text>
          <DailyHabitsView />
        </View> */}
      </ScrollView>
    </View>
  );
}

function createStyle(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,

      paddingHorizontal: theme.spacing.m,
      // paddingTop: theme.spacing.xl,
      gap: theme.spacing.s,
    },
    headerText: {
      color: theme.colors.text,
      ...theme.text.h3,
      marginRight: "10%",
    },
    habitsSection: {
      paddingTop: theme.spacing.s,
      marginTop: theme.spacing.l,
    },
    habitSectionText: {
      color: theme.colors.text,
      ...theme.text.h2,
      marginBottom: 5,
    },

    text: {
      color: theme.colors.text,
      ...theme.text.h2,
    },
  });
}
