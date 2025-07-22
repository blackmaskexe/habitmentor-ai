import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ChatLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="index"
      >
        <Stack.Screen
          name="index"
          //   options={{
          //     gestureEnabled: false, // this is because gestures on this screen will be managed by rn-gesture-handler
          //     // in order to do custom back handler to take you to home
          //   }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
