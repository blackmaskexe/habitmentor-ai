import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";

interface CheckButtonProps {
  size?: number;
  color?: string;
  taskCompleted?: boolean;
  outline?: boolean;
  onPress?: () => void;
}

export const CheckButton: React.FC<CheckButtonProps> = ({
  size = 24,
  color,
  taskCompleted,
  outline = true,
  onPress,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, outline);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        taskCompleted && styles.rounded,
        {
          width: size * 2, // More proportional sizing
          height: size * 2, // More proportional sizing
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={
          {
            //   opacity: taskCompleted ? 1 : 0.2,
          }
        }
      >
        <Ionicons
          name="checkmark-outline"
          size={size}
          color={theme.colors.textTertiary}
        />
      </View>
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
        borderColor: theme.colors.textTertiary,
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

export default CheckButton;
