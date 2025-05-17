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
import { date, weekdayNumber, formattedDate } from "@/utils/date";

// Components:

interface HabitItem {
  habitName: string;
  habitDeadline: string;
  habitFrequency: number;
  completedFrequency: number;
  points: number;
}

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

  const [habitItems, setHabitItems] = useState<any[]>([]);
  console.log("soano akhen khra", habitItems);

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
      console.log("damn this page was loaded, I am surprised that it did");
    }, [])
  );

  useEffect(() => {
    loadHabits(); // try and load the habits on mount

    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "activeHabits") {
        console.log("habits were changed somehow");
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

  const [taskCompletion, setTaskCompletion] = useState<any>([]); // track the ticking of the habit items

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
    setTaskCompletion((oldTaskCompletion: any) => {
      const newTaskCompletion = [...oldTaskCompletion];
      newTaskCompletion[index] = !oldTaskCompletion[index];
      return newTaskCompletion;
    });
  };

  const renderHabitItem = (habit: any, index: number) => {
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
          handleToggleTaskCompletion(index);
          if (isChecked) {
            // if the task is not completed (just clicked completed), then mark as complete
            onMarkAsComplete(habit.id, formattedDate);
          } else {
            // if the task is already checked, then mark as incomplete
            onMarkAsIncomplete(habit.id, formattedDate);
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
            >
              {habit.habitName}
            </Text>
            <Text style={styles.habitInfo}>{`+${habit.points} Points`}</Text>
          </View>
        }
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {habitItems.map((habit: any, index: any) => {
        if (habit && habit.frequency[weekdayNumber]) {
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
                    console.log("I think i've seen it twice all year", habit);
                    SheetManager.show("example-sheet", {
                      payload: {
                        sheetType: "habitItem",
                        habitItem: {
                          habit: habit,
                          habitIndex: index,
                        },
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

const createStyles = (theme: any) =>
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
