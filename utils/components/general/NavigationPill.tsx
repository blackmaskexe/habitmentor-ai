import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

export const NavigationPill: React.FC = () => {
  const colorScheme = useColorScheme();
  const pillColor = colorScheme === "dark" ? "#424242" : "#DDDDDD"; // the official iOS colors for the navigation pill to be consistent

  return <View style={[styles.pill, { backgroundColor: pillColor }]} />;
};

const styles = StyleSheet.create({
  pill: {
    width: 72,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
});

export default NavigationPill;
