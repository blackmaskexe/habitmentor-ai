import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/utils/theme/themes";
import CardWithoutImage from "../general/CardWithoutImage";
import {
  getHabitObjectFromId,
  updateEditedHabit,
} from "@/utils/database/habits";
import EditHabitForm from "./EditHabitForm";
import { FormValuesType } from "@/utils/types";
import CTAButton from "../general/CTAButton";

type UpdatedHabitType = {
  habitName: string;
  habitDescription: string;
  habitFrequency: boolean[];
};

export default function EditHabitView({
  onChangeDisplayScreen,
  habitId,
}: {
  onChangeDisplayScreen: (screen: string) => void;
  habitId: string;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [values, setValues] = useState<FormValuesType>({}); // values from the form

  const operatingHabit = getHabitObjectFromId(habitId)!;

  const [updatedHabit, setUpdatedHabit] = useState<UpdatedHabitType>({
    // usable edited habit information
    habitName: operatingHabit.habitName,
    habitDescription: operatingHabit.habitDescription || "",
    habitFrequency: operatingHabit.frequency,
  });

  useEffect(() => {
    // update card as soon as the value changes from the forms
    if (values.habitName) {
      setUpdatedHabit(() => {
        return {
          ...(values as any),
        };
      });
    }
  }, [values]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                `Update Habit`,
                "Are you sure?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: async () => {
                      await updateEditedHabit(
                        habitId,
                        updatedHabit.habitName,
                        updatedHabit.habitDescription,
                        updatedHabit.habitFrequency
                      );
                    },
                  },
                ],
                { cancelable: false }
              );
              onChangeDisplayScreen("main");
            }}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Habit</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <Text style={styles.saveHintText}>
          Press back button to save changes
        </Text>

        <View style={styles.habitPreviewCardContainer}>
          <CardWithoutImage
            title={updatedHabit.habitName}
            description={updatedHabit.habitDescription}
          />
        </View>
        <View style={styles.formContainer}>
          <EditHabitForm
            habitId={habitId}
            values={values}
            setValues={setValues}
          />
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      //   height: "60%",
      paddingTop: Platform.OS === "android" ? 15 : 5,
      marginHorizontal: theme.spacing.s,
    },

    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      // marginBottom: theme.spacing.s,
    },
    backButton: {
      padding: 5,
    },
    saveHintText: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      textAlign: "center",
      marginBottom: theme.spacing.s,
      opacity: 0.7,
    },
    habitPreviewCardContainer: {
      marginBottom: theme.spacing.m,
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
    formContainer: {
      marginHorizontal: theme.spacing.s,
    },
  });
