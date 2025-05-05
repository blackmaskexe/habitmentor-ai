import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";

interface GenericTextInputProps extends TextInputProps {
  initialValue?: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
}

export default function GenericTextInput({
  initialValue = "",
  placeholder = "Enter text",
  onTextChange,
  onSubmit,
  ...props
}: GenericTextInputProps) {
  const [text, setText] = useState(initialValue);

  const handleSubmit = () => {
    if (text.trim() && onSubmit) {
      onSubmit(text);
      // Only clear if desired - this might not be wanted for all use cases
      // setText("");
    }
  };

  const handleTextChange = function (newText: any) {
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    // >
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        onChangeText={(newText) => {
          setText(newText);
          if (onTextChange) {
            handleTextChange(newText);
          }
        }}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        placeholderTextColor="#AAAAAA"
        {...props}
      />
    </View>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    // backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  input: {
    width: "100%",
    minHeight: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1a1a1a",
  },
});
