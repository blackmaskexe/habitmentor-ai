import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";

import WeekdayFrequencyPicker from "./WeekdayFrequencyPicker";
import CTAButton from "../general/CTAButton";
import { useEffect, useState } from "react";
import { FormValuesType, HabitObject } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/utils/theme/themes";
import { useTheme } from "@/utils/theme/ThemeContext";
import { generateHabitId } from "@/utils/randomId";
import { addNewHabit, getHabitObjectFromId } from "@/utils/database/habits";
import { getFormattedDate } from "@/utils/date";
import CustomEditHabitForm from "./CustomEditHabitForm";

const { width } = Dimensions.get("window");
const BOX_SIZE = Math.min(width * 0.18, 80); // Responsive but capped at 80px in length and width

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fields = [
  {
    key: "habitName",
    label: "Habit Name",
    placeholder: "Example Habit",
    required: true,
  },
  {
    key: "habitDescription",
    label: "Habit Description",
    placeholder: "Example Description",
    required: false,
  },
];

export default function EditHabitForm({
  habitId,
  values,
  setValues,
}: {
  habitId: string;
  values: FormValuesType;
  setValues: (value?: any) => any;
}) {
  const theme = useTheme();
  const styles = createStyles(theme, BOX_SIZE);
  const [habitFrequency, setHabitFrequency] = useState<boolean[]>(
    Array(7).fill(false)
  );

  useEffect(() => {
    const habitObject: HabitObject = getHabitObjectFromId(habitId)!;

    setValues(() => {
      return {
        frequency: habitObject?.frequency,
        habitName: habitObject?.habitName,
        habitDescription: habitObject?.habitDescription,
      };
    });

    setHabitFrequency(() => {
      return habitObject.frequency;
    });
  }, []);

  console.log(values);

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CustomEditHabitForm
              fields={fields}
              onValueChange={(key, value) => {
                setValues((prev: any) => ({ ...prev, [key]: value }));
              }}
              values={values}
            />

            <View style={styles.spaceSmall} />
            <WeekdayFrequencyPicker
              currentFrequency={
                // sets the frequency property inside the values state
                daysOfWeek.filter((weekday, index) => {
                  if (habitFrequency[index]) return true; // filters such that only those days which are true in the habitFrequency make it in this array
                  // so [t,f,t,f,t,t,f] becomes ["Sun", "Tue", "Thu", "Fri"]
                  // I might fix this behavior of the WeekdayFrequencyPicker in the future, but letting it remain this way now
                }) || daysOfWeek
              }
              onChangeValues={setValues}
            />

            <Text style={styles.formLabel}></Text>
            {/* <WeekdayFrequencyPicker /> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

function createStyles(theme: Theme, boxSize: number) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.s,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background, // Same as modal background
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    box: {
      width: boxSize,
      height: boxSize,
      borderRadius: theme.radius.m,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textContainer: {
      flex: 1,
    },
    placeholder: {
      ...theme.text.h2,
      color: theme.colors.textSecondary,
    },
    subtitlePlaceholder: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      opacity: 0.7,
    },
    // modal styles:
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.altBackground, // this is the bg color of the modal window
      padding: theme.spacing.l,
      borderTopLeftRadius: theme.radius.l,
      borderTopRightRadius: theme.radius.l,
      minHeight: "90%",
    },
    modalTitle: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    formLabel: {
      ...theme.text.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    space: {
      marginVertical: theme.spacing.m,
    },
    spaceSmall: {
      marginVertical: theme.spacing.s,
    },
    headerLabel: {
      ...theme.text.body,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: theme.spacing.m,
    },
  });
}
