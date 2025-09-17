import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { StyleSheet, Text, View } from "react-native";
import CardWithoutImage from "../../general/CardWithoutImage";

type EmotionAwareTextMessageProps = {
  message: string;
};

export default function EmotionAwareTextMessage({
  message,
}: EmotionAwareTextMessageProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <>
      <View style={styles.headerContainer}>
        <CardWithoutImage
          title="Emotion Aware Suggestion"
          description="Get suggestions that combine your mood with your habit activity"
          ioniconName="heart"
          allowMultilineDescription
        />
      </View>

      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      marginHorizontal: theme.spacing.m,
    },
    headerContainer: {
      marginBottom: theme.spacing.s,
      marginHorizontal: theme.spacing.xs,
    },
    title: {
      ...theme.text.h3,
      color: theme.colors.text,
      fontWeight: "600",
    },
    subtitle: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    messageContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.l,
      alignSelf: "flex-start",
      maxWidth: "100%",
    },
    messageText: {
      ...theme.text.body,
      color: theme.colors.text,
      lineHeight: 22, // Improves readability
    },
  });
}
