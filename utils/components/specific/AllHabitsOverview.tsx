import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import OverviewHabitdropdownMenu from "./zeego/OverviewHabitDropdownMenu";
import { useEffect, useState } from "react";
import { getHabitCompletionCollection } from "@/utils/database/dataCollectionHelper";
import { HabitObject } from "@/utils/types";

export default function AllHabitsOverview({
  allHabitsArray,
}: {
  allHabitsArray: HabitObject[];
}) {
  const [habitRecords, setHabitRecords] = useState<any>({});

  useEffect(() => {
    // calculate habit streaks on mount
    // will be assigning the key of object as habitId, value as streak
    const loadHabitRecords = async function () {
      const habitCompletionCollection = await getHabitCompletionCollection();

      setHabitRecords(() => {
        const newHabitRecords: any = {};
        for (const habit of habitCompletionCollection) {
          newHabitRecords[habit.habitId] = {
            streak: habit.streak,
            completed: habit.timesCompleted,
            missed: habit.timesMissed,
          };
        }
        return newHabitRecords;
      });
    };

    loadHabitRecords();
  }, []);

  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.allHabitsContainer}>
      {allHabitsArray.map((habitItem, index) => {
        return (
          <View style={styles.habitCard} key={`habitcard-${habitItem.id}`}>
            <Ionicons name="today" style={styles.habitIcon} size={24} />
            <View style={styles.habitCardText}>
              <Text
                style={styles.habitName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {habitItem.habitName}
              </Text>
              <Text style={styles.habitDetails}>
                Streak: {habitRecords[habitItem.id]?.streak || 0} | Completed:{" "}
                {habitRecords[habitItem.id]?.completed || 0}
              </Text>
            </View>
            <View style={styles.habitCompletionDotContainer}>
              {Array(7).map((value, index) => {
                return (
                  <View
                    key={`${habitItem.habitName}-dot-${index}`}
                    style={styles.weekdayDot}
                  ></View>
                );
              })}
            </View>
            <OverviewHabitdropdownMenu habitItem={habitItem} />
          </View>

          // <View style={styles.habitCard}>
          //   <Ionicons name="today" style={styles.habitIcon} size={24} />
          //   <View style={styles.habitCardText}>
          //     <Text style={styles.habitName}>{habitItem.habitName}</Text>
          //     <Text style={styles.habitDetails}>
          //       Streak: 12 | 9 days until 21
          //     </Text>
          //   </View>
          //   <View style={styles.habitCompletionDotContainer}>
          //     {Array(7).map((value, index) => {
          //       return (
          //         <View
          //           key={`${habitItem.habitName}-dot-${index}`}
          //           style={styles.weekdayDot}
          //         ></View>
          //       );
          //     })}
          //   </View>
          //   <TouchableOpacity
          //     style={styles.habitOptions}
          //     onPress={() => {
          //       SheetManager.show("habit-sheet", {
          //         payload: {
          //           sheetType: "habitItem",
          //           habitItem: {
          //             habit: habitItem,
          //             habitIndex: index,
          //           },
          //         },
          //       });
          //     }}
          //   >
          //     <Ionicons
          //       name="ellipsis-vertical-outline"
          //       size={20}
          //       color={theme.colors.textSecondary}
          //     />
          //   </TouchableOpacity>
          // </View>
        );
      })}
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    allHabitsContainer: {
      //   padding: theme.spacing.m,
    },
    habitCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.s,
      borderRadius: theme.radius.m,
    },
    habitIcon: {
      marginRight: theme.spacing.m,
      color: theme.colors.primary,
    },
    habitCardText: {
      flex: 1, // Take up available space
    },
    habitName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    habitDetails: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    habitCompletionDotContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    weekdayDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginHorizontal: 2,
    },
    habitOptions: {
      alignSelf: "center",
    },
  });
}
