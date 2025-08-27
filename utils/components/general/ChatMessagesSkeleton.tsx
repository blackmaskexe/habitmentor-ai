import { useReducer } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/utils/theme/ThemeContext";

export default function ChatMessagesSkeleton() {
  const theme = useTheme();

  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      style={[styles.container, styles.padded]}
      animate={{ backgroundColor: theme.colors.background }}
    >
      <Skeleton width={250} colorMode={theme.theme as "light" | "dark"} />
      {/* <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={"100%"} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={"100%"} /> */}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: "center",
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  padded: {
    padding: 16,
  },
});
