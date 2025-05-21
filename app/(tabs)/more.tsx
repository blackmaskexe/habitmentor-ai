import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";

export default function Index() {
  const theme = useTheme();
  const styles = createStyle(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World From Settings!</Text>
    </View>
  );
}

function createStyle(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    text: {
      ...theme.text.h2,
    },
  });
}
