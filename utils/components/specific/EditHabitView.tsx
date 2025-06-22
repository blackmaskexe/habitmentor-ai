import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
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

  const operatingHabit = getHabitObjectFromId(habitId)!;

  const [updatedHabit, setUpdatedHabit] = useState<UpdatedHabitType>({
    habitName: operatingHabit.habitName,
    habitDescription: operatingHabit.habitDescription || "",
    habitFrequency: operatingHabit.frequency,
  });

  return (
    <>
      <SafeAreaView style={styles.container}>
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
        </View>

        <View style={styles.habitPreviewCardContainer}>
          <CardWithoutImage
            title={updatedHabit.habitName}
            description={updatedHabit.habitDescription}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: "60%",
      paddingTop: Platform.OS === "android" ? 15 : 5, // Reduced top padding
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 15, // Reduced margin below header
    },
    backButton: {
      padding: 5,
    },
    habitPreviewCardContainer: {
      flex: 1,
    },
  });
