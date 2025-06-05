import { useReducer } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/utils/theme/ThemeContext";

export default function AISuggestionSkeleton() {
  const theme = useTheme();

  return (
    <>
      <MotiView
        transition={{
          type: "timing",
        }}
        style={[styles.container, styles.padded]}
        animate={{ backgroundColor: theme.colors.background }}
      >
        <Skeleton
          width={"100%"}
          backgroundColor={theme.colors.altBackground}
          height={60}
          colorMode={theme.theme as any}
        />
        {/* <Skeleton width={"100%"} /> */}
        {/* <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={"100%"} /> */}
      </MotiView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
  },
  padded: {
    padding: 16,
  },
});
