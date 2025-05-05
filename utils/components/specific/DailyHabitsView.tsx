import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";

// Components:
import CheckButton from "../general/CheckButton";

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

  return (
    <ScrollView style={styles.container}>
      {habitItems.map((habit, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            console.log("Wake me up when you're on");
          }}
        >
          <View style={styles.habitCard}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{habit.habitName}</Text>
              <Text style={styles.habitDeadline}>{habit.habitDeadline}</Text>
            </View>
            <View style={styles.rightContent}>
              {/* <View style={styles.checkmarksRow}>
                {renderCheckmarks(
                  habit.habitFrequency,
                  habit.completedFrequency
                )}
              </View> */}
              <View>
                <CheckButton
                  size={16}
                  onPress={() => {
                    console.log("oh baby come to sleep");
                  }}
                />
              </View>
              {/* <Text style={styles.points}></Text> */}
            </View>
          </View>
        </TouchableOpacity>
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
    },
    habitName: {
      ...theme.text.body,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.s / 2,
    },
    habitDeadline: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
    },
    rightContent: {
      alignItems: "flex-end",
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
