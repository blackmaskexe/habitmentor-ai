import { useState, useEffect } from "react";
import { Keyboard, EmitterSubscription } from "react-native";

export const useKeyboardVisible = (): boolean => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener: EmitterSubscription = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardWillShowListener: EmitterSubscription = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener: EmitterSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    const keyboardWillHideListener: EmitterSubscription = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardWillShowListener.remove();
      keyboardDidShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};
