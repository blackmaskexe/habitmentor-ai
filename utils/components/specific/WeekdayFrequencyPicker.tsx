import { useTheme } from "@/utils/theme/ThemeContext";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
const weekdays = ["M", "T", "W", "TR", "F", "SA", "SU"];
import * as Haptics from "expo-haptics";

export default function WeekdayFrequencyPicker() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeDays, setActiveDays] = useState(Array(7).fill(false));

  const handleDayPress = function (index: number) {
    setActiveDays((oldActiveDays) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const newActiveDays = [...oldActiveDays];
      newActiveDays[index] = !newActiveDays[index];
      return newActiveDays;
    });
  };

  return (
    <View style={styles.weekdayFrequencyContainer}>
      {weekdays.map((daySymbol, index) => {
        return (
          <TouchableOpacity
            style={[
              activeDays[index]
                ? styles.weekdayItemActivated
                : styles.weekdayItemUnactivated,
              styles.weekdayItem,
            ]}
            onPress={() => {
              handleDayPress(index);
            }}
          >
            <Text style={styles.weekdayText}>{daySymbol}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    weekdayFrequencyContainer: {
      flexDirection: "row",
      justifyContent: "space-around", // Equal spacing
      alignItems: "center",
    },
    weekdayItem: {
      borderRadius: 5, // Make it circular
      width: 30, // Fixed width
      height: 30, // Fixed height
      justifyContent: "center", // Center content vertically
      alignItems: "center", // Center content horizontally
    },
    weekdayItemActivated: {
      backgroundColor: theme.colors.primary, // Primary color background
    },
    weekdayItemUnactivated: {
      backgroundColor: theme.colors.textTertiary, // Primary color background
    },
    weekdayText: {
      color: theme.colors.onPrimary || "white", // Ensure good contrast
      fontWeight: "bold",
    },
  });
}
