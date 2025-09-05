import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface ActivityIndicatorOverlayProps {
  visible?: boolean;
  size?: "small" | "large";
  color?: string;
}

const ActivityIndicatorOverlay: React.FC<ActivityIndicatorOverlayProps> = ({
  visible = true,
  size = "large",
  color = "#007AFF",
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
    minHeight: 80,
  },
});

export default ActivityIndicatorOverlay;
