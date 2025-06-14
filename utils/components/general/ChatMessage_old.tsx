import mmkvStorage from "@/utils/mmkvStorage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { MessageType } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { LegendList, LegendListRef } from "@legendapp/list";
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
import api from "@/utils/api";
import ChatMessagesSkeleton from "./ChatMessagesSkeleton";
import { getDate } from "@/utils/date";

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
  prefilledText,
}: {
  userName?: string;
  tooltips?: string[];
  prefilledText: string;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const textInputRef = React.useRef<TextInput>(null);
  const listRef = useRef<LegendListRef>(null); // Ref for LegendList

  const [messages, setMessages] = useState<MessageType[]>([]);

  const loadMessages = function () {
    let loadedMessages: MessageType[] = [];
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

  const [messageContent, setMessageContent] = useState(prefilledText);

  useEffect(() => {
    // to be able to load different initial messages when rendered using different parameters
    setMessageContent(prefilledText);
  }, [prefilledText]);

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

  const handleAIInteraction = async function (
    messageContent: string,
    aiMessageId: string
  ) {
    // creating a skeleton as the last message to indicate AI Activity:
    // setMessages((oldMessages) => {
    //   return [
    //     ...oldMessages,
    //     {
    //       sender: "system",
    //       content: "",
    //       loading: true, // loading set to true will make it render as a skeleton
    //       $createdAt: new Date(Date.now() + 212121),
    //     },
    //   ];
    // });

    // call the API to send a request to the server to fetch a response
    const response = await api.post("/chat", {
      message: messageContent,
      proActive: false,
    });

    console.log("It's not for romance", response);

    // populating the newly created message with the actual content:
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.id === aiMessageId
          ? {
              ...msg,
              content: response.data.response,
              loading: false,
            }
          : msg
      );
      // Save to storage AFTER AI response is processed and state is updated
      mmkvStorage.set("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const handleSendMessage = function () {
    // update immediately with user's message:
    const timeStamp = getDate();
    const userMessageId = timeStamp.toISOString() + "-user";
    const aiMessageId = timeStamp.toISOString() + "-ai";

    const newMessages: MessageType[] = [
      ...messages,
      {
        // user's message
        id: userMessageId,
        sender: "user",
        content: messageContent,
        $createdAt: getDate(),
        loading: false, // user's messages don't load because it is asynchronous
      },
      {
        // ai's message (skemleton rn, will become real one in the future)
        id: aiMessageId,
        sender: "ai",
        content: "",
        $createdAt: new Date(Date.now() + 5000),
        loading: true,
      },
    ];
    setMessages(newMessages);
    handleAIInteraction(messageContent, aiMessageId); // send message content before it's wiped

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
            renderItem={({ item }: { item: MessageType }) => {
              const isSender = item.sender == "user";
              return (
                <>
                  {item.loading ? (
                    <View style={styles.skeletonContainer}>
                      <ChatMessagesSkeleton />
                    </View>
                  ) : (
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
                  )}
                </>
              );
            }}
            keyExtractor={(item: any) => item?.$createdAt ?? "unknown"}
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
            extraData={theme} // smooth switching bewteen dark mode and light mode
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
              disabled={messageContent == "" ? true : false}
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

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    skeletonContainer: {
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
