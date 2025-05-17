import mmkvStorage from "@/utils/mmkvStorage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react"; // Ensure useCallback is imported
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function ChatMessages({
  // userName = "Person",
  tooltips,
  initialMessage,
}: {
  userName?: string;
  tooltips?: string[];
  initialMessage: string;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const textInputRef = React.useRef<any>(null);
  const listRef = useRef<any>(null); // Ref for LegendList

  const [messages, setMessages] = useState<any>([]);

  const loadMessages = function () {
    let loadedMessages: any[] = [];
    const storedMessages = mmkvStorage.getString("chatMessages");
    if (storedMessages) {
      loadedMessages = JSON.parse(storedMessages);
      setMessages(loadedMessages);
    } else {
      setMessages([]); // just have an empty array when the chatMessages mmkvKey is empty
    }
  };

  useEffect(() => {
    loadMessages(); // try and load the messages on mount

    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "chatMessages") {
        // detect when there is a change in the chat messages, and refresh the chat
        loadMessages();
      }
    });

    return () => {
      listener.remove(); // remove the listener on dismount
    };
  }, []);

  const [messageContent, setMessageContent] = useState(initialMessage);

  useEffect(() => {
    // to be able to load different initial messages when rendered using different parameters
    setMessageContent(initialMessage);
  }, [initialMessage]);

  useFocusEffect(
    useCallback(() => {
      // Invoked whenever the route is focused.
      // scrolls the chat to the absolute bottom (bottomest of the bottom)
      listRef.current?.scrollToEnd({ animated: true });

      return () => {
        // cleanup function
      };
    }, [messages])
  );

  const headerHeight = Platform.OS === "ios" ? useHeaderHeight() : 0;

  const handleSendMessage = function () {
    const newMessages = [
      ...messages,
      {
        sender: "user",
        content: messageContent,
        $createdAt: new Date(),
      },
    ];
    setMessages(newMessages);
    mmkvStorage.set("chatMessages", JSON.stringify(newMessages));
    setMessageContent("");

    listRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.kbAvoidingView}
          behavior={"padding"}
          keyboardVerticalOffset={headerHeight}
        >
          <LegendList
            data={messages}
            ref={listRef}
            renderItem={({ item }: { item: any }) => {
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
            initialScrollIndex={messages.length - 1}
            alignItemsAtEnd // Aligns to the end of the screen, so if there's only a few items there will be enough padding at the top to make them appear to be at the bottom.
            maintainScrollAtEnd // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainScrollAtEndThreshold={0.5} // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainVisibleContentPosition //Automatically adjust item positions when items are added/removed/resized above the viewport so that there is no shift in the visible content.
            estimatedItemSize={100} // estimated height of the item
            // getEstimatedItemSize={(info) => { // use if items are different known sizes
            //   console.log("info", info);
            // }}
          />
          <ScrollView
            style={styles.tooltipContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tooltipContentContainer}
          >
            {tooltips?.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.tooltipItem}
                  key={`tooltip-${item}`}
                  onPress={() => {
                    setMessageContent(item);
                  }}
                >
                  <Text style={styles.tooltipText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View
            style={{
              borderWidth: 1,
              borderColor: "black",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              // marginBottom: 6,
              marginHorizontal: 10,
            }}
          >
            <TextInput
              ref={textInputRef}
              placeholder="Type a message"
              style={{
                minHeight: 40,
                color: theme.colors.text,
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
      backgroundColor: theme.colors.background,
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
    // Tooltip Styles
    tooltipContainer: {
      maxHeight: 48,
      marginVertical: theme.spacing.xs,
      marginBottom: 12,
      marginTop: 12,
    },
    tooltipContentContainer: {
      padding: theme.spacing.s,
      gap: theme.spacing.s,
      alignItems: "center",
    },
    tooltipItem: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.m,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 36,
      justifyContent: "center",
      alignItems: "center",
      // Add subtle shadow for depth
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2, // for Android shadow
    },
    tooltipText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
  });
}
