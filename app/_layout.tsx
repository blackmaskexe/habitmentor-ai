import "@/utils/components/specific/ActionSheet/sheet";
import "@/utils/components/specific/ActionSheet/sheet";
import { SheetProvider } from "react-native-actions-sheet";
import { ThemeProvider, useTheme } from "@/utils/theme/ThemeContext";
import { Stack, useRouter } from "expo-router";
import {
  TourGuideProvider, // Main provider
} from "rn-tourguide";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/utils/theme/themes";

function AppNavigator() {
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

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
