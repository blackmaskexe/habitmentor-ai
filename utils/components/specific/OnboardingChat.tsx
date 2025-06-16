import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Prompt1 from "./OnboardingChatComponents/Prompt1";

// Prop Instructions:
// Send a message prop as follows:
// an array of objects:
// [
//   {
//     sender: "user",
//     content: "Hello! How can I help you today?",
//     $createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
//   },

// ];

export default function OnboardingChatMessages() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const textInputRef = React.useRef<any>(null);
  const [messageContent, setMessageContent] = useState("");
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for the ScrollView

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // Scroll to the end of the ScrollView when the keyboard is shown
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove(); // Clean up the listener
    };
  }, []);

  const headerHeight = Platform.OS === "ios" ? useHeaderHeight() : 0;

  const handleSendMessage = function () {};

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.kbAvoidingView}
          behavior={"padding"}
          keyboardVerticalOffset={headerHeight}
        >
          <ScrollView
            style={{
              flex: 1,
            }}
            ref={scrollViewRef} // Attach the ref to the ScrollView
          >
            <Prompt1 message="Do you downloaded this app so that you can improve your habits?" />
          </ScrollView>
          {/* <LegendList
            data={messagesArray}
            renderItem={({ item }: {item: any}) => {
              const isSender = item.sender == "user";
              return (
                <View
                  style={
                    isSender
                      ? styles.userMessageContainer
                      : styles.systemMessageContainer
                  }
                >
                 <View
                    style={
                      isSender
                        ? styles.userMessageContent
                        : styles.systemMessageContent
                    }
                  >
                    <Text style={{ fontWeight: "500", marginBottom: 4 }}>
                      {item.sender}
                    </Text>
                    <Text>{item.content}</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "right",
                      }}
                    >
                      {new Date(item.$createdAt!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item?.$createdAt ?? "unknown"}
            contentContainerStyle={{ padding: 10 }}
            recycleItems={true}
            initialScrollIndex={messagesArray.length - 1}
            alignItemsAtEnd // Aligns to the end of the screen, so if there's only a few items there will be enough padding at the top to make them appear to be at the bottom.
            maintainScrollAtEnd // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainScrollAtEndThreshold={0.5} // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainVisibleContentPosition //Automatically adjust item positions when items are added/removed/resized above the viewport so that there is no shift in the visible content.
            estimatedItemSize={100} // estimated height of the item
            // getEstimatedItemSize={(info) => { // use if items are different known sizes
            //   console.log("info", info);
            // }}
          /> */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "black",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              marginBottom: 6,
              marginHorizontal: 10,
            }}
          >
            <TextInput
              ref={textInputRef}
              placeholder="Type a message"
              style={{
                minHeight: 40,
                color: "white",
                flexShrink: 1, // prevent pushing the send button out of the screen
                flexGrow: 1, // allow the text input to grow keeping the send button to the right
                padding: 10,
              }}
              placeholderTextColor={"gray"}
              multiline
              value={messageContent}
              onChangeText={setMessageContent}
            />
            <Pressable
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleSendMessage}
            >
              <Ionicons
                name="paper-plane" // Ionicons often uses kebab-case
                size={24}
                color={messageContent ? theme.colors.primary : "gray"}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    kbAvoidingView: {
      flex: 1,
    },
    userMessageContainer: {
      padding: 10,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 6,
      maxWidth: "80%",
      alignSelf: "flex-end",
    },
    systemMessageContainer: {
      padding: 10,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 6,
      maxWidth: "80%",
      alignSelf: "flex-start",
    },
    userMessageContent: {
      backgroundColor: theme.colors.primary,
      flex: 1,
      padding: 10,
      borderRadius: 10,
    },
    systemMessageContent: {
      backgroundColor: theme.colors.textTertiary,
      flex: 1,
      padding: 10,
      borderRadius: 10,
    },
  });
}
