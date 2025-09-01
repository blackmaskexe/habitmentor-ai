import LeaderboardDropdownMenu from "@/utils/components/specific/zeego/LeaderboardDropdownMenu";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function LeaderboardLayout() {
  const theme = useTheme();
  // Changed from FeedLayout to ProgressLayout
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.tabBar,
        },
        headerTitleStyle: {
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Leaderboard",
          headerRight: () => {
            return <LeaderboardDropdownMenu />;
          },
        }}
      />
      <Stack.Screen
        name="[userId]"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
