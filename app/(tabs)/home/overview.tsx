// NOTE: THIS PAGE OPENS UP AS A MODAL

import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CrossButton from "@/utils/components/general/CrossButton";
import NavigationPill from "@/utils/components/general/NavigationPill";
import AllHabitsOverview from "@/utils/components/specific/AllHabitsOverview";
import MonthlyHabitActivityMonitor from "@/utils/components/specific/MonthlyHabitActivityMonitor";
import mmkvStorage from "@/utils/mmkvStorage";
import { Theme } from "@/utils/theme/themes";

const OverviewScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const activeHabits = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  return (
    <View style={styles.container}>
      {Platform.OS == "ios" ? (
        <>
          <NavigationPill />
          <View style={styles.closeButtonContainer}>
            <CrossButton
              onPress={() => router.replace("/(tabs)/home")}
              size={20}
              outline={false}
            />
          </View>
        </>
      ) : null}

      {/* changed from it being a modal to a standard screen */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerItem}>
            <Text style={styles.headerTextTop}>Longest Streak</Text>
            <Text style={styles.headerTextBottom}>21 days</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerTextTop}>Global Rank:</Text>
            <Text style={styles.headerTextBottom}>1</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.headerTextTop}>Total Points</Text>
            <Text style={styles.headerTextBottom}>
              {mmkvStorage.getNumber("totalPoints") || 0}
            </Text>
          </View>
        </View>

        <View style={styles.habitCompletion}>
          <Text style={styles.monthlyProgressText}>
            Monthly Progress Chart:
          </Text>

          {/* <TouchableOpacity
            onPress={() => {
              Alert.alert("Coming in the next update");
            }}
          > */}
          <MonthlyHabitActivityMonitor />
          {/* </TouchableOpacity> */}
          {/* <Text style={styles.monthlyProgressSubText}>
            click to view detailed consistency graph
          </Text> */}
          {/* <Text style={styles.weeklyTaskText}>Weekly Task Overview:</Text> */}
          {/* <WeeklyHabitsView /> */}
        </View>

        <View style={styles.allHabitsInfo}>
          <Text style={styles.monthlyProgressText}>All Habits Info</Text>
          <AllHabitsOverview allHabitsArray={activeHabits} />
        </View>
      </ScrollView>
      {/* <CTAButton
        title="press me brah"
        onPress={() => {
          router.push("/(tabs)/home/test");
        }}
      /> */}
    </View>
  );
};

function createStyles(theme: Theme) {
  // Assuming 'theme' matches your Theme type
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.m,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      marginBottom: theme.spacing.l,
    },
    headerItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.s,
    },
    headerTextTop: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    headerTextBottom: {
      ...theme.text.h3,
      color: theme.colors.text,
      fontWeight: "600",
    },
    scrollContainer: {
      marginTop: 30, // Keep existing margin or adjust as needed
      paddingHorizontal: theme.spacing.m, // Add horizontal padding to scroll content
    },
    closeButtonContainer: {
      position: "absolute",
      top: theme.spacing.l, // Adjust positioning if needed
      right: theme.spacing.m,
      zIndex: 1, // Ensure it's above other elements
    },

    weeklyHabitsConatiner: {
      // This container wraps WeeklyHabitsView.
      // Add styles here if you need specific layout or spacing for this wrapper
      // For example, if WeeklyHabitsView itself doesn't have margins:
      // marginBottom: theme.spacing.l,
    },
    // Keep existing text style if used elsewhere, or remove if unused
    text: {
      ...theme.text.h2,
      color: theme.colors.text,
    },
    habitCompletion: {},
    monthlyProgressText: {
      color: theme.colors.text,
      ...theme.text.h2,
      marginBottom: theme.spacing.s,
    },
    monthlyProgressSubText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      ...theme.text.small,
      marginTop: theme.spacing.xs,
    },
    weeklyTaskText: {
      marginTop: theme.spacing.xl,
      color: theme.colors.text,
      ...theme.text.h2,
    },
    allHabitsInfo: {
      marginTop: theme.spacing.l,
    },
  });
}

export default OverviewScreen;
