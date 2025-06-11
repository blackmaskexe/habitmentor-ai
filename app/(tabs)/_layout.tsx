import ChatDropDownMenu from "@/utils/components/specific/zeego/ChatDropDownMenu";
import HomeAddDropdownMenu from "@/utils/components/specific/zeego/HomeAddDropdownMenu";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, Dimensions, Platform } from "react-native";
import { TourGuideZone } from "rn-tourguide";

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();
  const currentPath = usePathname();
  const inOverviewView = currentPath == "/home/overview"; // checks if the current path is the weekly habits or not

  const { width } = Dimensions.get("window");
  console.log("said she wonna fa me later girl i'm into it", width);

  console.log("current path:", currentPath, "but i'm into it");
  // used by the header back arrow

  return (
    <Tabs
      screenOptions={{
        // sceneStyle: {
        //   backgroundColor: "black",
        // },
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
            <Ionicons name="home" size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: theme.spacing.m,
                marginRight: Platform.OS == "android" ? width / 4 - 32 : 0,
              }}
              onPress={() => {
                console.log("adapted to the models, I'm adapted to the bottle");
                if (inOverviewView) {
                  // goes to daily if in weekly, weekly if in daily
                  router.replace("/(tabs)/home");
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
              <TourGuideZone
                zone={2}
                text={
                  "View all of your habit streaks 🔥, completion graph 📈, and much more at a glance 👀!"
                }
                borderRadius={8}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    ...theme.text.body,
                    marginLeft: 4,
                  }}
                >
                  {Platform.OS == "ios" ? "Overview" : null}
                  {Platform.OS == "android" && inOverviewView ? "Home" : null}
                  {Platform.OS == "android" && !inOverviewView
                    ? "Overview"
                    : null}
                </Text>
              </TourGuideZone>
            </TouchableOpacity>
          ),
          headerRight: () => {
            return <HomeAddDropdownMenu />;
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          animation: "none",
          title: "AI Chat",
          tabBarIcon: ({ color, size }) => (
            <TourGuideZone
              zone={3}
              text={
                "Chat with the AI 🤖! Ask about ways to improve, be more consistent, and more!"
              }
              borderRadius={8}
            >
              <Ionicons name="chatbubbles" size={size} color={color} />
            </TourGuideZone>
          ),
          tabBarStyle: {
            display: "none",
          },

          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: theme.spacing.m,
              }}
              onPress={() => {
                console.log("adapted to the models, I'm adapted to the bottle");
                router.back();
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                style={{
                  color: theme.colors.primary,
                  ...theme.text.body,
                  marginLeft: 4,
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => {
            return <ChatDropDownMenu />;
          },
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
