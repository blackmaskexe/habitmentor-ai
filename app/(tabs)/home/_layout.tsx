import { runHabitDataCollection } from "@/utils/habits/habitDataCollectionHelper";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { HabitSheetProvider } from "@/utils/contexts/HabitSheetContext";

export default function RootLayout() {
  useEffect(() => {
    async function backgroundTasks() {
      await runHabitDataCollection();
    }
    backgroundTasks();
  }, []);
  return (
    <HabitSheetProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{
            animation: Platform.OS == "android" ? "none" : "fade",
          }}
        />
        <Stack.Screen
          name="overview"
          options={{
            presentation: "modal",
            animation:
              Platform.OS == "android" ? "fade_from_bottom" : "default",
          }}
        />
      </Stack>
    </HabitSheetProvider>
  );
}
