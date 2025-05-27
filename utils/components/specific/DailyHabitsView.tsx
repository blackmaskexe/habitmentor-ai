import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import mmkvStorage from "@/utils/mmkvStorage";
import { useFocusEffect } from "expo-router";
import {
  getAllHabitHistoryToday,
  onMarkAsComplete,
  onMarkAsIncomplete,
} from "@/utils/database/habitHistory";
import { getFormattedDate, getWeekdayNumber } from "@/utils/date";
import { HabitObject } from "@/utils/types";
import { Theme } from "@/utils/theme/themes";
import * as Haptics from "expo-haptics";
import { addPoints, subtractPoints } from "@/utils/database/points";

// Components:

// Dummy data
// const habitItems: HabitItem[] = [
//   {
//     habitName: "Morning Meditation",
//     habitDeadline: "8:00 AM",
//     habitFrequency: 1,
//     completedFrequency: 0,
//     points: 50,
//   },
//   {
//     habitName: "Drink Water",
//     habitDeadline: "Every 2 hours",
//     habitFrequency: 4,
//     completedFrequency: 1,
//     points: 100,
//   },
//   {
//     habitName: "Exercise",
//     habitDeadline: "6:00 PM",
//     habitFrequency: 1,
//     completedFrequency: 1,
//     points: 150,
//   },
// ];

const DailyHabitsView: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [habitItems, setHabitItems] = useState<HabitObject[]>([]);

  const loadHabits = function () {
    // fetch habits from mmkvStorage
    let loadedHabits: any[] = [];
    const storedHabitsString = mmkvStorage.getString("activeHabits");
    if (storedHabitsString) {
      loadedHabits = JSON.parse(storedHabitsString);
      setHabitItems(loadedHabits);
    } else {
      throw new Error("Not able to fetch active habits from mmkvStorage");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  useEffect(() => {
    loadHabits(); // try and load the habits on mount

    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "activeHabits") {
        // reload the habits if the activeHabits change
        console.log(
          mmkvStorage.getString("activeHabits"),
          "the active habits has changed somewhat, please see"
        );
        loadHabits();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  // extracting habit items that are active from the mmkvStorage
  // const storedHabitsString =
  //   mmkvStorage.getString("activeHabits") || JSON.stringify([]);
  // const habitItems: any[] = JSON.parse(storedHabitsString);

  const [taskCompletion, setTaskCompletion] = useState<boolean[]>([]); // track the ticking of the habit items

  useEffect(() => {
    setTaskCompletion(() => {
      // upon loading of all the habits into the habitItems state variable,
      const newTaskCompletion = Array(habitItems.length).fill(false);
      // fill the above with falses, and switch those to true which have been completed

      // looping throgu all the habitItem completions for today's date to see if
      const completedHabitsToday = getAllHabitHistoryToday();
      for (const habitEntry of completedHabitsToday) {
        habitItems.forEach((item, index) => {
          if (item.id == habitEntry.habitId) {
            newTaskCompletion[index] = true;
          }
        });
      }

      return newTaskCompletion;
    });
  }, [habitItems]); // set the taskCompletion state according to the data stored in the database
  const handleToggleTaskCompletion = (index: number) => {
    setTaskCompletion((oldTaskCompletion: boolean[]) => {
      const newTaskCompletion = [...oldTaskCompletion];
      newTaskCompletion[index] = !oldTaskCompletion[index];
      return newTaskCompletion;
    });
  };

  const renderHabitItem = (habit: HabitObject, index: number) => {
    // rendering logic for each of the habit tasks for today
    return (
      <BouncyCheckbox
        isChecked={taskCompletion[index]}
        size={28}
        fillColor={theme.colors.primary}
        // unFillColor="#FFFFFF"
        text={habit.habitName}
        // iconStyle={{ borderColor: "red" }}
        // innerIconStyle={{ borderWidth: 2 }}
        textStyle={{
          fontFamily: "JosefinSans-Regular",
          color: theme.colors.text,
        }}
        onPress={(isChecked: boolean) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleToggleTaskCompletion(index);
          if (isChecked) {
            // if the task is not completed (just clicked completed), then mark as complete + add points
            onMarkAsComplete(habit.id, getFormattedDate());
            addPoints(habit.points);
          } else {
            // if the task is already checked, then mark as incomplete + subtract points
            onMarkAsIncomplete(habit.id, getFormattedDate());
            subtractPoints(habit.points);
          }
        }}
        // onLongPress={() => {}}
        textComponent={
          <View style={styles.habitTextContainer}>
            <Text
              style={[
                styles.habitName,
                taskCompletion[index] && {
                  textDecorationLine: "line-through",
                  color: theme.colors.textSecondary,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail" // displays ... when habit name is too long
            >
              {habit.habitName.slice(0, 30)}
              {habit.habitName.length > 29 ? "..." : null}
            </Text>
            <Text style={styles.habitInfo}>{`+${habit.points} Points`}</Text>
          </View>
        }
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {habitItems.map((habit: HabitObject, index: number) => {
        if (habit && habit.frequency[getWeekdayNumber()]) {
          // if the current day matches with the day
          // the habit is supposed to happen on
          // therefore, renders habit based on if they are to be done today:

          return (
            <View key={index}>
              <View style={styles.habitCard}>
                {renderHabitItem(habit, index)}

                <TouchableOpacity
                  style={styles.habitOptions}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    console.log("I think i've seen it twice all year", habit);
                    SheetManager.show("example-sheet", {
                      payload: {
                        sheetType: "habitItem",
                        habit: habit,
                      },
                    });
                  }}
                >
                  <Ionicons
                    name="ellipsis-vertical-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      })}
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    habitCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      //   marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
    habitInfo: {
      flex: 1,
      color: theme.colors.textSecondary,
    },
    habitName: {
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s / 2,
    },
    habitOptions: {
      alignSelf: "center",
    },
    habitDeadline: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
    },
    habitTextContainer: {
      marginLeft: 16,
    },
    checkmarksRow: {
      flexDirection: "row",
      marginBottom: theme.spacing.s / 2,
    },
    checkmarkContainer: {
      marginLeft: theme.spacing.s,
    },
    points: {
      ...theme.text.small,
      color: theme.colors.textTertiary,
    },
  });

export default DailyHabitsView;
