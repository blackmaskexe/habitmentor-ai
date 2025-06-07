// import { Stack } from "expo-router";
// import { useTheme } from "@/utils/theme/ThemeContext";

// export default function OnboardingLayout() {
//   const theme = useTheme();

//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         contentStyle: {
//           backgroundColor: theme.colors.background,
//         },
//         presentation: "card",
//         animation: "slide_from_right",
//       }}
//     />
//   );
// }
import { useTheme } from "@/utils/theme/ThemeContext";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

// Components:

export default function OnboardingLayout() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        presentation: "card",
        animation: "slide_from_right",
        headerLargeStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Inbox",
          headerTitleStyle: { color: theme.colors.text },
          headerLargeTitle: true,
          headerTransparent: false,
          // headerTransparent: false, this was messing with the background of header ts, but nevermind
          headerSearchBarOptions: {
            placeholder: "Search a contact",
          },
        }}
      />
      <Stack.Screen name="1" />
      <Stack.Screen name="2" />
      <Stack.Screen name="3" />
    </Stack>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    headerText: {
      fontSize: 17,
      fontWeight: "600",
      color: theme.colors.text,
    },
  });
}
