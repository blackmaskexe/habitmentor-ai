import { useTheme } from "@/utils/theme/ThemeContext";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getProActiveMessage } from "@/utils/api";
import AISuggestionSkeleton from "@/utils/components/specific/AISuggestionSkeleton";
import DailyHabitsView from "@/utils/components/specific/DailyHabitsView";
import WeekAtAGlance from "@/utils/components/specific/WeekGlance";
import { getMetadataRecords } from "@/utils/database/dailyMetadataRecords";
import {
  getRecentProActiveMessage,
  setRecentProActiveMessage,
  shouldRequestProActiveMessage,
} from "@/utils/database/proActiveMessageManager";
import {
  getDate,
  getDateFromFormattedDate,
  getDateMinusNDays,
  getFormattedDate,
  relationBetweenTodayAndDate,
} from "@/utils/date";
import {
  getHabitCompletionCollection,
  getImportantMessages,
} from "@/utils/habits/habitDataCollectionHelper";
import mmkvStorage from "@/utils/mmkvStorage";
import { tagHabits } from "@/utils/tagManager";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-native-type-animation";
import { TourGuideZone, useTourGuideController } from "rn-tourguide";

export default function Index() {
  console.log(getAuth(), "tapshi tapshi");
  // mmkvStorage.set("appStartDate", "2025-7-25");
  console.log(
    "only taking pictures you gon have to take your azom",
    JSON.stringify(getMetadataRecords(7))
  );

  const [proActiveMessage, setProActiveMessage] = useState<string | null>(null); // will eventually fetch it's last value from a key-value store so that the user doesn't have to stare at the "loading" for 1-3 seconds
  const [proActiveMessageHeight, setProActiveMessageHeight] =
    useState<number>(76); // 76 because it is the height of the skeleton (60 height + 16 margin)

  const animatedHeight = useRef(new Animated.Value(76)).current; // starting value is 76 because of same above reason

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: proActiveMessageHeight,
      duration: 150, // Animation duration
      useNativeDriver: false, // Important: height cannot be natively animated
    }).start();
  }, [proActiveMessageHeight]);

  const [shouldUserTour, setShouldUserTour] = useState<boolean | null>(null);

  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

  useEffect(() => {
    const didTourApp = mmkvStorage.getBoolean("didTourApp");
    if (didTourApp == undefined) {
      // the user hasn't toured in this case, and should be the only time the tour should show
      setShouldUserTour(() => {
        mmkvStorage.set("didTourApp", true);
        return true;
      });

      // run the tagging endpoint:
      tagHabits();
    } else {
      setShouldUserTour(false);
    }
  }, []);

  useEffect(() => {
    if (canStart && shouldUserTour) {
      // 👈 test if you can start otherwise nothing will happen
      start();
    }
  }, [canStart]); // 👈 don't miss it!

  const [habitsDate, setHabitsDate] = useState(getDate());

  function handleDateBack() {
    setHabitsDate((oldDate) => {
      const newDate = new Date(oldDate);
      newDate.setDate(oldDate.getDate() - 1);
      return newDate;
    });
  }
  function handleDateForward() {
    if (getFormattedDate(habitsDate) == getFormattedDate(getDate())) return; // early return to prevent going into the fuuture

    setHabitsDate((oldDate) => {
      const newDate = new Date(oldDate);
      newDate.setDate(oldDate.getDate() + 1);
      return newDate;
    });
  }

  const theme = useTheme();
  const styles = createStyle(theme, proActiveMessageHeight);

  useEffect(() => {
    // call the method that starts the process of sending the proActiveMessage
    // showProActiveMessage(setProActiveMessage);

    async function showProActiveMessage() {
      if (shouldRequestProActiveMessage() || true) {
        // for testing purpose rn
        // this is the part where I send all of the metadata and related information of user's habits
        // to the fine tuned ai model, and return whatever it gives out

        const habitCompletionCollection: any =
          await getHabitCompletionCollection();
        const importantMessages: string[] = await getImportantMessages();

        const response = await getProActiveMessage(
          habitCompletionCollection,
          importantMessages
        );

        if (response && response.data && response.data.response) {
          setProActiveMessage(response.data.response);

          // set the mmkvstorage with the recent pro active message:
          setRecentProActiveMessage(response.data.response);
        }
      } else {
        setProActiveMessage(getRecentProActiveMessage());
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
        <WeekAtAGlance />

        <Animated.View style={[styles.aiSection]}>
          <Text style={styles.aiSectionHeading}>Top AI Suggestion:</Text>
          {proActiveMessage ? (
            <>
              <Text
                style={{
                  // ghost element, serves as getting the size of the actual Top AI Suggestion text, so can pre-position the Habits for Today
                  opacity: 0,
                  position: "absolute",
                  ...styles.aiSuggestionText,
                }}
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setProActiveMessageHeight(height);
                }}
              >
                {proActiveMessage}
              </Text>
              <Animated.View
                style={{
                  height: animatedHeight,
                }}
              >
                <TypeAnimation
                  sequence={[{ text: proActiveMessage }]}
                  style={{
                    ...styles.aiSuggestionText,
                  }}
                  typeSpeed={1}
                  cursor={Platform.OS == "ios"}
                />
              </Animated.View>
            </>
          ) : (
            <AISuggestionSkeleton />
          )}

          <TourGuideZone
            zone={1}
            text={"😤 Let's walk you through the cool features of this app 😤"}
            borderRadius={8}
          />
        </Animated.View>
        <View style={styles.habitsSection}>
          <View style={styles.habitSectionHeading}>
            <Text style={styles.habitSectionText}>
              Habits for {relationBetweenTodayAndDate(habitsDate)}:
            </Text>
            <View style={styles.jumpToDayContainer}>
              <TouchableOpacity
                onPress={handleDateBack}
                // makes the button disabled if the user just started their app
                // so that they cannot view days that are before when they started
                disabled={
                  getDateMinusNDays(
                    -1,
                    getDateFromFormattedDate(
                      mmkvStorage.getString("appStartDate")!
                    )
                  ) > habitsDate
                }
                style={[
                  styles.jumpToDayButton,
                  {
                    opacity:
                      getDateMinusNDays(
                        -1,
                        getDateFromFormattedDate(
                          mmkvStorage.getString("appStartDate")!
                        )
                      ) > habitsDate
                        ? 0.5
                        : 1,
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  getFormattedDate(habitsDate) == getFormattedDate(getDate())
                }
                style={[
                  styles.jumpToDayButton,
                  {
                    opacity:
                      getFormattedDate(habitsDate) ==
                      getFormattedDate(getDate())
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={handleDateForward}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <DailyHabitsView date={habitsDate} />
        </View>

        {/* <View style={styles.habitsSection}>
          <Text style={styles.habitSectionText}>Upcoming Milestones:</Text>
          <DailyHabitsView />
        </View> */}
      </ScrollView>
    </View>
  );
}

function createStyle(theme: Theme, proActiveMessageHeight: number) {
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
      marginTop: theme.spacing.l,
    },
    habitSectionHeading: {
      // New or significantly changed
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.s,
    },
    jumpToDayContainer: {
      // New
      flexDirection: "row",
    },
    jumpToDayButton: {
      // New
      marginLeft: theme.spacing.s,
      padding: theme.spacing.xs,
    },
    habitSectionText: {
      color: theme.colors.text,
      ...theme.text.h2,
      marginBottom: theme.spacing.s,
    },
    aiSection: {
      paddingTop: theme.spacing.s,
      marginTop: theme.spacing.m,
    },
    aiSectionHeading: {
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
