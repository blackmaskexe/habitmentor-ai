import { runHabitDataCollection } from "@/utils/database/dataCollectionHelper";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    async function backgroundTasks() {
      await runHabitDataCollection();
      console.log("check money benny-ing");
    }
    backgroundTasks();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="overview"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
