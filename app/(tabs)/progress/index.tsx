import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";

export default function Index() {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.text}>Hello, World From Progress!</Text>
      </View>
    </ScrollView>
  );
}
function createStyles(theme: any) {
  return StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100%",
    },
    text: {
      ...theme.text.h2,
    },
  });
}
