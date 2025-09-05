import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface CrossButtonProps {
  size?: number;
  color?: string;
  rounded?: boolean;
  outline?: boolean;
  onPress?: () => void;
}

export const CrossButton: React.FC<CrossButtonProps> = ({
  size = 24,
  color,
  rounded = false,
  outline = true,
  onPress,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, outline);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        rounded && styles.rounded,
        {
          width: size * 2, // More proportional sizing
          height: size * 2, // More proportional sizing
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={rounded ? "close-circle" : "close"}
        size={size}
        color={color || theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, outline: boolean) =>
  StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",

      ...(outline && {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.round,
      }),
    },
    rounded: {
      backgroundColor: theme.colors.altBackground,
      borderRadius: theme.radius.round,
      ...(outline && {
        borderWidth: 1,
        borderColor: theme.colors.border,
      }),
    },
  });

export default CrossButton;
