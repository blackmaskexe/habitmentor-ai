import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

/**
 * CardGrid2x1: Arranges two Card children in a responsive 2x1 grid (side by side)
 * Usage:
 * <CardGrid2x1>
 *   <Card ... />
 *   <Card ... />
 * </CardGrid2x1>
 */
type CardGrid2x1Props = {
  children: React.ReactNode;
};

export default function CardGrid2x1({ children }: CardGrid2x1Props) {
  const theme = useTheme();
  const styles = createStyles(theme);
  // Only render first two children
  const cards = React.Children.toArray(children).slice(0, 2);
  return (
    <View style={styles.row}>
      {cards.map((child, idx) => (
        <View key={idx} style={styles.cardWrapper}>
          {child}
        </View>
      ))}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.s,
      alignItems: "flex-start",
      width: "100%",
      paddingHorizontal: 8,
      marginVertical: 8,
    },
    cardWrapper: {
      flex: 1,
      marginHorizontal: 4,
      // To ensure cards don't overflow on small screens
      maxWidth: (screenWidth - 32) / 2,
    },
  });
}
