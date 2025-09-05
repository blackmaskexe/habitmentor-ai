import React from "react";
import { StyleSheet, View } from "react-native";

type CardGridProps = {
  children: React.ReactNode;
};

const CardGrid: React.FC<CardGridProps> = ({ children }) => {
  // Ensure we only render up to 2 children
  const validChildren = React.Children.toArray(children).slice(0, 2);

  return <View style={styles.gridContainer}>{validChildren}</View>;
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
});

export default CardGrid;
