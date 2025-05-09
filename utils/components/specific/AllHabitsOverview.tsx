import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function AllHabitsOverview({
  allHabitsArray,
}: {
  allHabitsArray: any[];
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  console.log("Drop down yeah", theme.colors.altBackground);
  return (
    <View style={styles.allHabitsContainer}>
      {allHabitsArray.map((habitItem, index) => {
        return (
          <View style={styles.habitCard} key={`${habitItem.habitName}-card`}>
            <Ionicons name="today" style={styles.habitIcon} size={24} />
            <View style={styles.habitCardText}>
              <Text style={styles.habitName}>{habitItem.habitName}</Text>
              <Text style={styles.habitDetails}>
                Streak: 12 | 9 days until 21
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
          </View>
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
  });
}
