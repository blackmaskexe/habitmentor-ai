import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import BouncyCheckbox from "react-native-bouncy-checkbox";

// Components:

interface HabitItem {
  habitName: string;
  habitDeadline: string;
  habitFrequency: number;
  completedFrequency: number;
  points: number;
}

// Dummy data
const habitItems: HabitItem[] = [
  {
    habitName: "Morning Meditation",
    habitDeadline: "8:00 AM",
    habitFrequency: 1,
    completedFrequency: 0,
    points: 50,
  },
  {
    habitName: "Drink Water",
    habitDeadline: "Every 2 hours",
    habitFrequency: 4,
    completedFrequency: 1,
    points: 100,
  },
  {
    habitName: "Exercise",
    habitDeadline: "6:00 PM",
    habitFrequency: 1,
    completedFrequency: 1,
    points: 150,
  },
];

const DailyHabitsView: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [taskCompletion, setTaskCompletion] = useState<any>(
    Array(habitItems.length).fill(false)
  ); // track the ticking of the habit items

  const handleToggleTaskCompletion = (index: number) => {
    setTaskCompletion((oldTaskCompletion: any) => {
      const newTaskCompletion = [...oldTaskCompletion];
      newTaskCompletion[index] = !oldTaskCompletion[index];
      return newTaskCompletion;
    });
  };

  // const renderCheckmarks = (frequency: number, completed: number) => {
  //   return Array.from({ length: frequency }).map((_, index) => (
  //     <View key={index} style={styles.checkmarkContainer}>
  //       <Ionicons
  //         name="checkmark-circle-outline"
  //         size={24}
  //         color={
  //           index < completed ? theme.colors.primary : theme.colors.textTertiary
  //         }
  //       />
  //     </View>
  //   ));
  // };

  const renderHabitItem = (habit: any, index: number) => {
    return (
      <BouncyCheckbox
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
        onPress={() => handleToggleTaskCompletion(index)}
        onLongPress={() => {}}
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
            <Text style={styles.habitInfo}>{habit.habitDeadline}</Text>
          </View>
        }
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {habitItems.map((habit, index) => (
        <View key={index}>
          <View style={styles.habitCard}>
            {/* <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{habit.habitName}</Text>
              <Text style={styles.habitDeadline}>{habit.habitDeadline}</Text>
            </View> */}
            {renderHabitItem(habit, index)}

            <TouchableOpacity
              style={styles.habitOptions}
              onPress={() => {
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
      ))}
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
