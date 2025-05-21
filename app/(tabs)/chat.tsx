import ChatMessages from "@/utils/components/general/ChatMessage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const Chat = () => {
  const { prefilledText }: { prefilledText: string } = useLocalSearchParams();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ChatMessages
      tooltips={[
        "Help improve habit",
        "Consistency Tips",
        "What can I do better for",
        "Where in the app can I find",
      ]}
      prefilledText={prefilledText || ""}
    />
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {},

    text: {},
  });
}

export default Chat;
