import "@/utils/components/specific/ActionSheet/sheet";
import { ThemeProvider, useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SheetProvider } from "react-native-actions-sheet";
import {
  TourGuideProvider, // Main provider
} from "rn-tourguide";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

function AppNavigator() {
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const url = Linking.useLinkingURL();

  useEffect(() => {
    async function runExpoLinking() {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      if (!hasOnboarded) return; // early return if the user hasn't onboarded

      if (url) {
        const { hostname, path, queryParams } = Linking.parse(url);
        if (path === "friend-invite" && queryParams && queryParams.senderId) {
          // router.push(""); // push to leaderboard/profile page with custom prop payload in the router push
        }
      }
    }
  }, [url]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "96863368182-n72dgcej7466ersf9h6cicucttl0pgel.apps.googleusercontent.com",
    });
  }, []);

  return (
    <TourGuideProvider
      backdropColor="rgba(0,0,0,0.7)"
      labels={{
        previous: "Previous",
        next: "Next",
        finish: "Finish",
        skip: "‎",
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="index"
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(onboarding)"
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </TourGuideProvider>
  );
}

export default function RootLayout() {
  return (
    <SheetProvider>
      <ThemeProvider>
        {/* This chochla is to be able to use themes within the root _layout.tsx */}
        <AppNavigator />
      </ThemeProvider>
    </SheetProvider>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    backText: {
      color: theme.colors.primary,
      fontSize: 16,
      marginLeft: 2,
    },
  });
}
