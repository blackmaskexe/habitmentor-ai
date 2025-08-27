import { useReducer } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";

export default function AISuggestionSkeleton() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <MotiView
        transition={{
          type: "timing",
        }}
        style={[styles.container]}
        animate={{ backgroundColor: theme.colors.background }}
      >
        <Skeleton
          width={"100%"}
          // backgroundColor={theme.colors.altBackground}
          height={60}
          colorMode={theme.theme as "light" | "dark"}
        />
        {/* <Skeleton width={"100%"} /> */}
        {/* <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={"100%"} /> */}
      </MotiView>
    </>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      marginTop: theme.spacing.m,
      borderRadius: 16,
      // justifyContent: "center",
    },
    padded: {
      padding: 16,
    },
  });
}
