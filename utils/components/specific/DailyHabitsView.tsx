import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
// import {
//   getAllHabitHistoryToday,
//   onMarkAsComplete,
//   onMarkAsIncomplete,
// } from "@/utils/database/habitHistory";
import {
  getDate,
  getDateFromFormattedDate,
  getFormattedDate,
  getWeekdayNumber,
} from "@/utils/date";
import { HabitObject } from "@/utils/types";
import { Theme } from "@/utils/theme/themes";
import * as Haptics from "expo-haptics";
import { addPoints, subtractPoints } from "@/utils/database/points";
import {
  getAllHabitHistoryOnDate,
  getAllHabitHistoryToday,
  onMarkAsComplete,
  onMarkAsIncomplete,
} from "@/utils/database/habitHistoryManager";
import { TourGuideZone } from "rn-tourguide";

const DailyHabitsView = ({ date }: { date: Date }) => {
  // date prop used to show the habits for different days
  const theme = useTheme();
  const styles = createStyles(theme);

  const [habitItems, setHabitItems] = useState<HabitObject[]>([]);

  // const habitItems: HabitObject[] = useMemo(() => {
  //   // fetch habits from mmkvStorage
  //   let loadedHabits: any[] = [];
  //   const storedHabitsString = mmkvStorage.getString("activeHabits");
  //   if (storedHabitsString) {
  //     loadedHabits = JSON.parse(storedHabitsString);
  //     return loadedHabits;
  //   } else {
  //     console.log("Unable to load the habits from mmkv");
  //     // throw new Error("Not able to fetch active habits from mmkvStorage");
  //     return [];
  //   }
  // }, []);

  const loadHabits = function () {
    // fetch habits from mmkvStorage
    let loadedHabits: HabitObject[] = [];
    const storedHabitsString = mmkvStorage.getString("activeHabits");
    if (storedHabitsString) {
      loadedHabits = JSON.parse(storedHabitsString);

      // gotta run the logic of if the habit is skipped or not here (if the entry for today exists, and there's a skipped in it, then don't return that)

      // writing the visible habits (habits that haven't been skipped + habits that have a start date on or before the date of display)
      const visibleHabits = loadedHabits.filter((habit, index) => {
        // filtering logic for habits added at a future date
        if (getFormattedDate(getDate()) != getFormattedDate(date)) {
          // if not viewing today's habits
          if (date > getDateFromFormattedDate(habit.startDate!)) {
            return true; // if it is added on or before that date, then show bindaas
          } else {
            return false; // don't show habit if the habit is added after this date
          }
        }

        // filtering logic for habits that are skipped todday
        for (const habitEntry of getAllHabitHistoryToday()) {
          if (habit.id == habitEntry.habitId && habitEntry.skipped) {
            return false; // don't render the item if it is skipped ONLY TODAY
          }
        }
        return true; // return true if the item is not skipped
      });

      setHabitItems(visibleHabits);
    } else {
      throw new Error("Not able to fetch active habits from mmkvStorage");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [date]) // date dependency to reload habits when date changes
  );

  useEffect(() => {
    loadHabits(); // try and load the habits on mount

    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "activeHabits") {
        // reload the habits if the activeHabits change
        // or habits are skipped (change in habitHistory key)

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
      const completedHabitsOnDate = getAllHabitHistoryOnDate(date);
      for (const habitEntry of completedHabitsOnDate) {
        habitItems.forEach((item, index) => {
          if (item.id == habitEntry.habitId) {
            newTaskCompletion[index] = true;
          }
        });
      }

      return newTaskCompletion;
    });
  }, [habitItems, date]); // set the taskCompletion state according to the data stored in the database
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
          // the isChecked is updated, then all of this is triggered, so isChecked = true means we gotta do the action when button will be checked
          if (isChecked) {
            // if the task is not completed (just clicked completed), then mark as complete + add points
            onMarkAsComplete(habit.id, date, false); // skip is false
            addPoints(habit.points);
          } else {
            // if the task is already checked, then mark as incomplete + subtract points
            onMarkAsIncomplete(habit.id, date);
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

  const renderHabitCard = (habit: HabitObject, index: number) => {
    if (habit && habit.frequency[getWeekdayNumber(date)]) {
      // if the current day matches with the day
      // the habit is supposed to happen on
      // therefore, renders habit based on if they are to be done today:

      return (
        <View key={index}>
          <TouchableOpacity
            style={styles.habitCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              SheetManager.show("example-sheet", {
                payload: {
                  sheetType: "habitItem",
                  habit: habit,
                  habitDate: date,
                },
              }).then((res) => {
                // on closing of the ActionSheet (is when the promise is fullfilled, refresh habits)
                loadHabits();
              });
            }}
          >
            {renderHabitItem(habit, index)}

            <TouchableOpacity
              style={styles.habitOptions}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                SheetManager.show("example-sheet", {
                  payload: {
                    sheetType: "habitItem",
                    habit: habit,
                    habitDate: date,
                  },
                }).then((res) => {
                  // on closing of the ActionSheet (is when the promise is fullfilled, refresh habits)
                  loadHabits();
                });
              }}
            >
              {index == 0 ? (
                <TourGuideZone
                  key={index}
                  zone={4}
                  text={
                    "Click to set reminders 🔔, get AI tools 🤖, and much more!"
                  }
                  borderRadius={8}
                  shape="circle"
                >
                  <Ionicons
                    name="ellipsis-vertical-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TourGuideZone>
              ) : (
                <Ionicons
                  name="ellipsis-vertical-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {habitItems.map((habit: HabitObject, index: number) => {
        return renderHabitCard(habit, index);
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
