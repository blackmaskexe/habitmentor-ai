import ChatMessages from "@/utils/components/general/ChatMessage";
import ChatDropDownMenu from "@/utils/components/specific/zeego/ChatDropDownMenu";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

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
          headerRight: () => <ChatDropDownMenu />,
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
