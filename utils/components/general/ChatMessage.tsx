import { getChatMessage } from "@/utils/firebase/functions/chatManager";
import { getDate, getTimeOfDay } from "@/utils/date";
import { addImportantMessage } from "@/utils/habits/habitDataCollectionHelper";
import mmkvStorage from "@/utils/mmkvStorage";
import { generateMessageId } from "@/utils/randomId";
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
import ChatMessagesSkeleton from "./ChatMessagesSkeleton";
import GenericList from "./GenericList";

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

type UserPromptType = {
  message: string;
  importantMessageHistory?: string[];
  metadata?: any;
  // recentMissedHabits?: string[];
  timeOfDay?: "morning" | "afternoon" | "evening";
  // preferredTone?: string;
};

type AIResponseType = {
  data: {
    actionableSteps: string[];
    importantMessage: boolean;
    response: string;
  };
};

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
  const headerHeight = Platform.OS === "ios" ? useHeaderHeight() : 0;

  const [messages, setMessages] = useState<MessageType[]>([]); // initialize a null messages state
  const [messageContent, setMessageContent] = useState(prefilledText); // manages contents of input box

  const loadMessages = function () {
    let loadedMessages: MessageType[] = [];
    const storedMessages = mmkvStorage.getString("chatMessages");
    if (storedMessages && storedMessages.length > 0) {
      loadedMessages = JSON.parse(storedMessages);
      setMessages(loadedMessages);
    } else {
      setMessages([]); // just have an empty array when the chatMessages mmkvKey is empty
    }
  };

  useEffect(() => {
    // ensure that prefilled text is set whenever it is updated
    setMessageContent(prefilledText);
  }, [prefilledText]);

  // load messages on mount
  useEffect(() => {
    loadMessages();
    setTimeout(() => {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    }, 500);

    // add listener to see changes to messages (to detect message clearing)
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

  // scroll down to bottom on screen focus
  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    }, [])
  );

  const handleSendMessage = async function () {
    // creating objects for user and ai's messages:

    const userMessage: MessageType = {
      id: generateMessageId(),
      sender: "user",
      content: messageContent,
      $createdAt: getDate(),
      loading: false,
    };

    const aiMessage: MessageType = {
      id: generateMessageId(),
      sender: "ai",
      content: "",
      $createdAt: getDate(),
      loading: true,
    };

    // update the messages immediately with the user's message + ai's message skeleton
    setMessages((prevMessages) => {
      return [...prevMessages, userMessage, aiMessage];
    });

    // scroll after user sends the message
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // clear the text input:
    setMessageContent("");

    // make response request to the API:

    const response = await getChatMessage(
      userMessage.content,
      messages.slice(-20)
    );

    // populating the ai message skeleton with response data:
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) => {
        if (msg.id == aiMessage.id) {
          return {
            ...msg,
            content: response
              ? response.data.response
              : "the AI failed to load message",
            loading: false,
            additionalData: {
              actionableSteps: response.data.actionableSteps,
            },
          };
        }

        return msg;
      });

      mmkvStorage.set("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    // store message if it was deemed important by the AI

    if (response.data.importantMessage) {
      await addImportantMessage(userMessage.content);
    }

    // smooth scroll to bottom once the state is updated
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.kbAvoidingView}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
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
                        {item.additionalData?.actionableSteps ? (
                          <Text
                            style={{
                              marginTop: theme.spacing.s,
                            }}
                          >
                            <GenericList
                              textSize={12}
                              textColor="#1a1a1a"
                              items={item.additionalData.actionableSteps.map(
                                (actionableStep, index) => {
                                  return {
                                    listText: actionableStep,
                                    bullet: {
                                      type: "text",
                                      bulletText: "⭐️",
                                    },
                                  };
                                }
                              )}
                            />
                          </Text>
                        ) : null}

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
            keyExtractor={(item: any) => item?.id ?? "unknown"}
            contentContainerStyle={{ padding: 10 }}
            recycleItems={true}
            initialScrollIndex={messages.length - 1}
            alignItemsAtEnd
            maintainScrollAtEnd
            maintainScrollAtEndThreshold={0.5}
            maintainVisibleContentPosition
            estimatedItemSize={100}
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
              marginBottom: 6,
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
