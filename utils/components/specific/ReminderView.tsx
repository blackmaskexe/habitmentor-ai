import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import CTAButton from "../general/CTAButton"; // Assuming this is your custom button
import { Theme } from "@/utils/theme/themes";
import { useNotifications } from "@/utils/useNotifications";
import {
  getHabitObjectFromId,
  updateHabitNotificationTime,
} from "@/utils/database/habits";
import { getDate, getFormattedTime } from "@/utils/date";
import mmkvStorage from "@/utils/mmkvStorage";

// update state variable that holds habit when habit changes in the mmkvStorage
// now the todo right now is what is the root component that houses the habit item so that
// I can add the event listener there and it can propagate downwards

interface ReminderViewProps {
  initialTime?: Date;
  onTimeChange?: (newTime: Date) => void;
  onChangeDisplayScreen: (screen: string) => void;
  habitId: string;
}

export default function ReminderView({
  initialTime,
  onTimeChange,
  onChangeDisplayScreen,
  habitId,
}: ReminderViewProps) {
  const { schedulePushNotification } = useNotifications();

  const theme = useTheme();
  const styles = createStyles(theme);

  const [time, setTime] = useState(initialTime || getDate());

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      const newTime = new Date(time);
      newTime.setHours(selectedDate.getHours());
      newTime.setMinutes(selectedDate.getMinutes());
      newTime.setSeconds(0);
      newTime.setMilliseconds(0);

      setTime(newTime);
      if (onTimeChange) {
        onTimeChange(newTime);
      }
    }
  };

  useEffect(() => {
    if (initialTime) {
      setTime(initialTime);
    }
  }, [initialTime]);

  const handleSetReminder = async () => {
    // first of all, set the mmkv to isNotificationEnabled to true:
    mmkvStorage.set("isNotificationOn", true);
    // then start the process of scheduling a notification thru expo notifications
    console.log(
      "Set Reminder CTA pressed for time:",
      time.toLocaleTimeString()
    );
    const habit = getHabitObjectFromId(habitId); // using id to get the latest version of the habitObject
    // (need latest copy in order to manage notifications)
    if (habit) {
      await schedulePushNotification(time, habit);
      updateHabitNotificationTime(habitId, getFormattedTime(time));
    }
    onChangeDisplayScreen("main");
  };

  const handleBackPress = () => {
    console.log("pressed back");
    onChangeDisplayScreen("main");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Set Reminder Time</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <Text style={styles.tooltipText}>
        You will be reminded to check off your habit each day your habit is due
        at this time
      </Text>

      <View style={styles.pickerContainer}>
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={Platform.OS === "ios" ? undefined : true}
          display="spinner"
          onChange={handleTimeChange}
          style={styles.dateTimePicker}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CTAButton
          title={`${
            getHabitObjectFromId(habitId)?.isNotificationOn ? "Reset" : "Set"
          } Reminder to ${time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
          onPress={handleSetReminder} // Use the actual handler
          buttonHeight={44}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      minHeight: 400, // Adjusted minHeight to accommodate tooltip
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: Platform.OS === "android" ? 15 : 5, // Reduced top padding
      paddingBottom: 30,
      paddingHorizontal: 15,
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 15, // Reduced margin below header
      // marginTop: 15, // Removed marginTop to reduce space above title
    },
    backButton: {
      padding: 5,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
      flex: 1,
    },
    headerRightPlaceholder: {
      width: 28 + 10,
    },
    tooltipText: {
      ...theme.text.body,
      color: theme.colors.text,
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 15, // Space before the picker
      fontWeight: "normal",
      // lineHeight: 18,
    },
    pickerContainer: {
      width: "100%",
      minHeight: Platform.OS === "ios" ? 216 : 220,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    dateTimePicker: {
      width: "100%",
    },
    buttonContainer: {
      // Styles for the container of your CTAButton
      width: "70%", // Takes 90% of the available width
      alignSelf: "center", // Ensure it's centered if parent is alignItems: 'center'
    },
  });
