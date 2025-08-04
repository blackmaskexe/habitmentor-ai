import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import { Theme } from "@/utils/theme/themes";
import { useRouter } from "expo-router";

export default function AiSuggestions() {
  const router = useRouter();

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <CardWithoutImage
        title="AI Assistant"
        onPress={() => {
          router.push("/chat");
        }}
        description="Click to chat with your AI Assistant"
        iconLetters="AI"
      />
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.m,
    },
  });
}
