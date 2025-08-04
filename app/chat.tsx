import React from "react";
import { View, StyleSheet } from "react-native";
import ChatMessages from "@/utils/components/general/ChatMessage";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Stack } from "expo-router";

export default function Chat() {
  const { prefilledText }: { prefilledText: string } = useLocalSearchParams();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <Stack.Screen
        options={{
          title: "AI Chat",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <View style={{ flex: 1 }}>
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
    </>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {},
    text: {},
  });
}
