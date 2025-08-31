import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekdayFrequencyPicker({
  initialFrequency,
  onChangeValues, // values of the object that will be set as the habitObject's properties
  values,
}: {
  initialFrequency?: boolean[];
  onChangeValues: (updater: (oldValue: any) => any) => void;
  values: any;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeDays, setActiveDays] = useState(
    initialFrequency || Array(7).fill(true)
  );

  useEffect(() => {
    // change the frequency if it is changed by any other means
    // mainly, the frequency changing dropdown
    console.log("VALUE BADLA", values);
    if (values.frequency) {
      console.log(
        "Bring your best friend, then pull up to the west end",
        values
      );
      setActiveDays(values.frequency);
    }
  }, [values]);

  const handleDayPress = function (index: number) {
    setActiveDays((oldActiveDays) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const newActiveDays = [...oldActiveDays];
      newActiveDays[index] = !newActiveDays[index];

      onChangeValues((oldValues) => {
        const newValues = { ...oldValues, frequency: newActiveDays };
        return newValues;
      });

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
