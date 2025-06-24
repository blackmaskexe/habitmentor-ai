import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/utils/theme/themes";
import CardWithoutImage from "../general/CardWithoutImage";
import { getHabitObjectFromId } from "@/utils/database/habits";
import EditHabitForm from "./EditHabitForm";
import { FormValuesType } from "@/utils/types";

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

  const [values, setValues] = useState<FormValuesType>({});

  const operatingHabit = getHabitObjectFromId(habitId)!;

  const [updatedHabit, setUpdatedHabit] = useState<UpdatedHabitType>({
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
      marginBottom: theme.spacing.s,
    },
    backButton: {
      padding: 5,
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
