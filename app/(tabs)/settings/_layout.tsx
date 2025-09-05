import { useTheme } from "@/utils/theme/ThemeContext";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "default",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          color: theme.colors.text,
        },
      }}
      initialRouteName="index"
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="edit-leaderboard"
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="erase-data"
        options={{
          title: "Erase Data",
        }}
      />
    </Stack>
  );
}
