import "@/utils/components/specific/ActionSheet/sheet";
import { SheetProvider } from "react-native-actions-sheet";
import { ThemeProvider } from "@/utils/theme/ThemeContext";
import { Stack } from "expo-router";
import {
  TourGuideProvider, // Main provider
} from "rn-tourguide";

export default function RootLayout() {
  return (
    <SheetProvider>
      <ThemeProvider>
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
          </Stack>
        </TourGuideProvider>
      </ThemeProvider>
    </SheetProvider>
  );
}
