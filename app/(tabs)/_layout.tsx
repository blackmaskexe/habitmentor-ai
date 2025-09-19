import HomeAddDropdownMenu from "@/utils/components/specific/zeego/HomeAddDropdownMenu";
// import { areHabitsTagged, tagHabits } from "@/utils/tagManager";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TourGuideZone } from "rn-tourguide";
import firestore from "@react-native-firebase/firestore";
import { syncDataToFirebaseProfile } from "@/utils/firebase/firestore/profileManager";

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();
  const currentPath = usePathname();
  const inOverviewView = currentPath == "/home/overview"; // checks if the current path is the weekly habits or not

  const { width } = Dimensions.get("window");

  // APP INITIALIZATION (After it has loaded):
  // not tagging habits anymore, unnecessary imo
  // if (!areHabitsTagged()) {
  //   tagHabits();
  // }
  if (getAuth().currentUser) {
    // run syncing the user's leaderboard profile data to firestore:
    syncDataToFirebaseProfile();
  }

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Listen for pending friend requests
    const unsubscribe = firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("friends")
      .where("status", "==", "pending_received")
      .onSnapshot((snapshot) => {
        setPendingRequestsCount(snapshot ? snapshot.size : 0);
      });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <Tabs
      screenOptions={{
        // sceneStyle: {
        //   backgroundColor: "black",
        // },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0.167,
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
        name="suggestions"
        options={{
          // animation: "none",
          title: "AI Suggestions",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TourGuideZone
              zone={3}
              text={
                "Look at suggestions by the AI, updated every week! Plus, Chat with your Personal Habit Assistant any time"
              }
              borderRadius={8}
            >
              <Ionicons name="sparkles" size={size} color={color} />
            </TourGuideZone>
          ),

          // headerLeft: () => (
          //   <TouchableOpacity
          //     style={{
          //       flexDirection: "row",
          //       alignItems: "center",
          //       marginLeft: theme.spacing.m,
          //     }}
          //     onPress={() => {
          //       router.back();
          //     }}
          //   >
          //     <Ionicons
          //       name="chevron-back"
          //       size={24}
          //       color={theme.colors.primary}
          //     />
          //     <Text
          //       style={{
          //         color: theme.colors.primary,
          //         ...theme.text.body,
          //         marginLeft: 4,
          //       }}
          //     >
          //       Back
          //     </Text>
          //   </TouchableOpacity>
          // ),
          // headerRight: () => {
          //   return <ChatDropDownMenu />;
          // },
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          headerShown: false,
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => {
            const styles = StyleSheet.create({
              badgeContainer: {
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: theme.colors.error,
                borderRadius: 9,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: theme.colors.background,
              },
              badgeText: {
                color: "white",
                fontSize: 10,
                fontWeight: "bold",
              },
            });
            return (
              <View>
                <Ionicons name="stats-chart" size={size} color={color} />
                {pendingRequestsCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{pendingRequestsCount}</Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
