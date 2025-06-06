import { useTheme } from "@/utils/theme/ThemeContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import TypewriterText from "@/utils/components/general/TypewriterText";
import DailyHabitsView from "@/utils/components/specific/DailyHabitsView";
import WeekAtAGlance from "@/utils/components/specific/WeekGlance";
import { Theme } from "@/utils/theme/themes";
import { useEffect, useState } from "react";
import {
  getRecentProActiveMessage,
  setRecentProActiveMessage,
  shouldRequestProActiveMessage,
} from "@/utils/database/proActiveMessageManager";
import { TypeAnimation } from "react-native-type-animation";
import {
  getHabitCompletionCollection,
  getImportantMessages,
} from "@/utils/database/dataCollectionHelper";
import api from "@/utils/api";
import AISuggestionSkeleton from "@/utils/components/specific/AISuggestionSkeleton";
import mmkvStorage from "@/utils/mmkvStorage";

export default function Index() {
  const theme = useTheme();
  const styles = createStyle(theme);

  const [proActiveMessage, setProActiveMessage] = useState(
    getRecentProActiveMessage()
  ); // will eventually fetch it's last value from a key-value store so that the user doesn't have to stare at the "loading" for 1-3 seconds

  useEffect(() => {
    // call the method that starts the process of sending the proActiveMessage
    // showProActiveMessage(setProActiveMessage);

    async function showProActiveMessage() {
      if (shouldRequestProActiveMessage()) {
        // for testing purpose rn
        // this is the part where I send all of the metadata and related information of user's habits
        // to the fine tuned ai model, and return whatever it gives out

        const response = await api.post("/pro-active", {
          habitCompletionCollection: await getHabitCompletionCollection(),
          importantMessages: await getImportantMessages(),
        });

        if (response && response.data.response) {
          setProActiveMessage(response.data.response);

          // set the mmkvstorage with the recent pro active message:
          setRecentProActiveMessage(response.data.response);
        }
      } else {
        console.log("You don't have to fetch the important messages bro");
      }
    }
    showProActiveMessage();
  }, []);

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
        <View style={styles.aiSection}>
          <Text style={styles.aiSectionText}>Top AI Suggestion:</Text>
          {proActiveMessage ? (
            <TypeAnimation
              sequence={[{ text: proActiveMessage }]}
              style={styles.aiSuggestionText}
              typeSpeed={1}
            />
          ) : (
            // <Text style={styles.aiSuggestionText}>{proActiveMessage}</Text>

            <AISuggestionSkeleton />
          )}
        </View>
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

function createStyle(theme: Theme) {
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
    aiSuggestionText: {
      ...theme.text.body, // Changed from h3 to body for smaller text
      color: theme.colors.textSecondary,
      width: "100%",
      textAlign: "left",
    },
    habitsSection: {
      flex: 1,
      paddingTop: theme.spacing.s,
      marginTop: theme.spacing.l,
    },
    habitSectionText: {
      color: theme.colors.text,
      ...theme.text.h2,
      marginBottom: 5,
    },
    aiSection: {
      paddingTop: theme.spacing.s,
      marginTop: theme.spacing.m,
      height: 120,
    },
    aiSectionText: {
      color: theme.colors.text,
      ...theme.text.h2,
      marginBottom: 7,
    },

    text: {
      color: theme.colors.text,
      ...theme.text.body,
    },
  });
}
