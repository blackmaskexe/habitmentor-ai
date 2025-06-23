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
import GenericForm from "../general/GenericForm";
import TaskFrequencyDropdownMenu from "./zeego/TaskFrequencyDropdownMenu";
import WeekdayFrequencyPicker from "./WeekdayFrequencyPicker";
import CTAButton from "../general/CTAButton";
import { useEffect, useState } from "react";
import { FormValuesType } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/utils/theme/themes";
import { useTheme } from "@/utils/theme/ThemeContext";
import { generateHabitId } from "@/utils/randomId";
import { addNewHabit, getHabitObjectFromId } from "@/utils/database/habits";
import { getFormattedDate } from "@/utils/date";

const { width } = Dimensions.get("window");
const BOX_SIZE = Math.min(width * 0.18, 80); // Responsive but capped at 80px in length and width

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

export default function EditHabitForm({ habitId }: { habitId: string }) {
  const theme = useTheme();
  const styles = createStyles(theme, BOX_SIZE);
  const [values, setValues] = useState<FormValuesType>({});
  const [habitFrequency, setHabitFrequency] = useState([]);

  useEffect(() => {
    setValues((oldValues) => {
      const habitObject = getHabitObjectFromId(habitId);
      return {
        frequency: habitObject?.frequency,
        habitName: habitObject?.habitName,
        habitDescription: habitObject?.habitDescription,
      };
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
            <GenericForm
              fields={fields}
              onValueChange={(key, value) => {
                setValues((prev: any) => ({ ...prev, [key]: value }));
              }}
              values={values}
            />
            <TaskFrequencyDropdownMenu
              index={0}
              onSetHabitFrequency={setHabitFrequency} // sets the frequency property inside the values state
            />

            <View style={styles.spaceSmall} />
            <WeekdayFrequencyPicker
              currentFrequency={
                // sets the frequency property inside the values state
                habitFrequency[0] || [
                  "Sun",
                  "Mon",
                  "Tue",
                  "We",
                  "Thu",
                  "Fri",
                  "Sat",
                ]
              }
              onChangeValues={setValues}
            />

            <Text style={styles.formLabel}></Text>
            {/* <WeekdayFrequencyPicker /> */}
            <CTAButton
              title={"Submit"}
              disabled={values.habitName ? false : true}
              onPress={() => {
                // adding points + id to the habit
                const newHabit = { ...values };

                if (newHabit && newHabit.frequency) {
                  // if the frequency property exists within that habit item:
                  // seeing how many days the user is doing that particular habit:
                  const daysHabitIsActive = newHabit.frequency.reduce(
                    (count: number, value: boolean) => {
                      return value ? count + 1 : count;
                    },
                    0
                  );

                  // points are calculated in the following manner:
                  // daily habits give 20 points each (daysHabitIsActive == 7)
                  // 5-6 habit days give 15 points
                  // 1-4 habit days give 10 points

                  const habitPoints = [0, 10, 10, 10, 10, 15, 15, 20];
                  // adding a  0 in the start to make this array 1 indexable, and also work with 0 frequency days
                  // the 0 frequency days is implemented to prevent any crashes

                  newHabit.points = habitPoints[daysHabitIsActive];

                  // as well as assign the unique ID:
                  newHabit.id = generateHabitId();

                  // and associate a startDate with it:
                  newHabit.startDate = getFormattedDate();
                  addNewHabit(newHabit as any);
                }
              }}
              iconName="checkmark-circle-outline"
            />
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
