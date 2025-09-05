import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface CTAButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconName?: IoniconsName; // Changed to string for Ionicons name
  iconSize?: number; // Optional size for the icon
  buttonHeight?: number;
  isBackgroundVisible?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  iconName,
  iconSize = 20, // Default icon size,
  buttonHeight = 54,
  isBackgroundVisible = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(
    theme,
    buttonHeight,
    isBackgroundVisible,
    disabled
  );
  return (
    <TouchableOpacity
      style={
        isBackgroundVisible
          ? [styles.button, disabled && styles.buttonDisabled]
          : [styles.button, styles.noBackgroundButton]
      }
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.contentContainer}>
          {iconName && (
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={iconSize}
                color={
                  isBackgroundVisible
                    ? "white"
                    : disabled
                    ? theme.colors.textSecondary
                    : theme.colors.primary
                }
              />
            </View>
          )}
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

function createStyles(
  theme: Theme,
  buttonHeight: number,
  isBackgroundVisible: boolean,
  disabled: boolean
) {
  return StyleSheet.create({
    button: {
      width: "100%",
      height: buttonHeight,
      backgroundColor: theme.button.background,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      shadowColor: theme.button.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      // marginVertical: 12,
    },
    buttonDisabled: {
      backgroundColor: theme.button.disabledBackground,
      shadowOpacity: 0,
      elevation: 0,
    },
    noBackgroundButton: {
      backgroundColor: "transparent",
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      marginRight: 8,
    },
    text: {
      color: isBackgroundVisible
        ? theme.button.textColor
        : disabled
        ? theme.colors.textSecondary
        : theme.colors.primary,
      fontSize: theme.button.textSize,
      fontWeight: "600",
      textAlign: "center",
    },
  });
}

export default CTAButton;
