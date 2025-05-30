import "@/utils/components/specific/ActionSheet/sheet";
import { SheetProvider } from "react-native-actions-sheet";
import { ThemeProvider } from "@/utils/theme/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SheetProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </SheetProvider>
  );
}
