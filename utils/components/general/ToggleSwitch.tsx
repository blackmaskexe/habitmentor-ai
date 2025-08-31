import { useTheme } from "@/utils/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

interface ToggleSwitchProps {
  initialState: boolean; // this enabled means the state of the toggle (off or on)
  onToggle: (value: boolean) => void; // callback function passed that receives the state of the switch, and do actions based on that
  // feeds the to-be state of the switch after the user clicks on the switch
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  currentState?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initialState,
  currentState,
  onToggle,
  disabled = false,
  size = "medium",
}) => {
  const [isEnabled, setIsEnabled] = useState(initialState);
  const theme = useTheme();
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentState != undefined) {
      setIsEnabled(currentState);
    }
  }, [currentState]);

  // Size configurations
  const sizes = {
    small: { track: { width: 36, height: 20 }, knob: 16 },
    medium: { track: { width: 44, height: 24 }, knob: 22 },
    large: { track: { width: 52, height: 28 }, knob: 24 },
  };

  const currentSize = sizes[size];
  const padding = (currentSize.track.height - currentSize.knob) / 2;
  const toggleDistance = currentSize.track.width - currentSize.knob - padding;

  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: isEnabled ? toggleDistance : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  }, [isEnabled, toggleDistance]);

  const handlePress = () => {
    if (!disabled) {
      setIsEnabled((oldIsEnabled) => {
        onToggle(!oldIsEnabled);
        return !oldIsEnabled;
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const styles = StyleSheet.create({
    track: {
      width: currentSize.track.width,
      height: currentSize.track.height,
      borderRadius: currentSize.track.height / 2,
      backgroundColor: isEnabled
        ? theme.toggle.track.enabled
        : theme.toggle.track.disabled,
      padding: padding,
      opacity: disabled ? 0.5 : 1,
    },
    knob: {
      width: currentSize.knob,
      height: currentSize.knob,
      borderRadius: currentSize.knob / 2,
      backgroundColor: theme.toggle.knob.background,
      shadowColor: theme.toggle.knob.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 2,
    },
  });

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [
                { translateX: slideAnimation },
                { translateY: isEnabled ? 2 : 0 },
              ],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

export default ToggleSwitch;
