import React, { useRef } from "react";
import {
  Alert,
  View,
  PanResponder,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import ChatMessages from "@/utils/components/general/ChatMessage";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { useRouter } from "expo-router";

const Chat = () => {
  const { prefilledText }: { prefilledText: string } = useLocalSearchParams();
  const theme = useTheme();
  const styles = createStyles(theme);

  const router = useRouter();

  const startXRef = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { x0 } = gestureState;
        // Only start tracking if user touched near left edge (e.g. < 30px)
        return Platform.OS === "ios" && x0 < 30;
      },
      onPanResponderGrant: (evt, gestureState) => {
        startXRef.current = gestureState.moveX;
      },
      onPanResponderMove: (evt, gestureState) => {
        // no-op unless you want visual feedback
      },
      onPanResponderRelease: (evt, gestureState) => {
        const deltaX = gestureState.moveX - (startXRef.current || 0);
        if (deltaX > 50) {
          console.log("Detected manual left-to-right swipe!");
          router.navigate("/(tabs)/home");
        }
        startXRef.current = null;
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      {/* Edge swipe area */}
      <View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 30, // Only left 30px is swipeable
          zIndex: 10,
        }}
        pointerEvents="auto"
      />
      {/* Main content */}
      <ChatMessages
        tooltips={[
          "Help improve habit",
          "Consistency Tips",
          "What can I do better for",
          "Where in the app can I find",
        ]}
        prefilledText={prefilledText || ""}
      />
    </View>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {},
    text: {},
  });
}

export default Chat;
