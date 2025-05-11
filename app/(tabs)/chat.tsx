import ChatMessages from "@/utils/components/general/ChatMessage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const Chat = () => {
  const { initialMessage } = useLocalSearchParams();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ChatMessages
      tooltips={[
        "Buy a unun",
        "Sell a unun",
        "Dap up a unun",
        "Get a unun pass",
      ]}
      initialMessage={(initialMessage as any) || ""}
    />
  );
};

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {},

    text: {},
  });
}

export default Chat;
