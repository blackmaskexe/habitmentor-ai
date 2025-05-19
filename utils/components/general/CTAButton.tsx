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

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface CTAButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconName?: IoniconsName; // Changed to string for Ionicons name
  iconSize?: number; // Optional size for the icon
  buttonHeight?: number;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  iconName,
  iconSize = 20, // Default icon size,
  buttonHeight = 54,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, buttonHeight);
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
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
              <Ionicons name={iconName} size={iconSize} color="#FFFFFF" />
            </View>
          )}
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

function createStyles(theme: any, buttonHeight: number) {
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
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      marginRight: 8,
    },
    text: {
      color: theme.button.textColor,
      fontSize: theme.button.textSize,
      fontWeight: "600",
      textAlign: "center",
    },
  });
}

export default CTAButton;
