import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();
  const currentPath = usePathname();
  const inOverviewView = currentPath == "(tabs)/home/overview"; // checks if the current path is the weekly habits or not
  // used by the header back arrow

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0.5,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: theme.spacing.m,
              }}
              onPress={() => {
                console.log("adapted to the models, I'm adapted to the bottle");
                if (inOverviewView) {
                  // goes to daily if in weekly, weekly if in daily
                  router.back(); // the same as router.replace('/(tabs)/home')
                } else {
                  router.push("/(tabs)/home/overview");
                }
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                style={
                  {
                    color: theme.colors.primary,
                    ...theme.text.body,
                    marginLeft: 4,
                  } as any
                }
              >
                Overview
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
