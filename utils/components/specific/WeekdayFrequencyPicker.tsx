import { useTheme } from "@/utils/theme/ThemeContext";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const weekdays = ["Sun", "Mon", "Tue", "We", "Thu", "Fri", "Sat"];
import * as Haptics from "expo-haptics";
import { Theme } from "@/utils/theme/themes";

export default function WeekdayFrequencyPicker({
  currentFrequency,
  onChangeValues,
}: {
  currentFrequency: string[];
  onChangeValues: (updater: (oldValue: any) => any) => void;
}) {
  useEffect(() => {
    // When currentFrequency changes, then change how the
    // boxes for weekdays are displayed

    onHabitFrequencyChange();
  }, [currentFrequency]);

  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeDays, setActiveDays] = useState(Array(7).fill(true));

  useEffect(() => {
    // write to the GenericForm's value the frequency data about the habit
    updateValueState(activeDays);
  }, [activeDays]);

  const updateValueState = function (newActiveDays: any) {
    onChangeValues((oldValue: any) => {
      const newValue = oldValue;
      newValue.frequency = activeDays;
      console.log("my style ain't free", newValue);

      return newValue;
    });
  };

  const onHabitFrequencyChange = function () {
    console.log(currentFrequency);

    const newActiveDays = Array(7).fill(false);
    weekdays.forEach((item, index) => {
      if (currentFrequency.includes(item)) {
        newActiveDays[index] = true;
      }
    });
    setActiveDays(newActiveDays);

    console.log("these are the new active days after update", newActiveDays);
  };

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
            key={daySymbol}
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

function createStyles(theme: Theme) {
  return StyleSheet.create({
    weekdayFrequencyContainer: {
      flexDirection: "row",
      justifyContent: "space-around", // Equal spacing
      alignItems: "center",
      width: "100%",
      alignSelf: "center",
      marginBottom: theme.spacing.m,
    },
    weekdayItem: {
      borderRadius: 10, // Make it circular
      width: 40, // Fixed width
      height: 40, // Fixed height
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
      color: "white", // Ensure good contrast
      fontWeight: "bold",
    },
  });
}
