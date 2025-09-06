import { getDate, getFormattedDate } from "@/utils/date";
import mmkvStorage from "@/utils/mmkvStorage";
import { generateMessageId } from "@/utils/randomId";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { MessageType } from "@/utils/types";
import { LegendList, LegendListRef } from "@legendapp/list";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react"; // Ensure useCallback is imported
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatMessagesSkeleton from "../general/ChatMessagesSkeleton";
import CTAButton from "../general/CTAButton";

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

export default function OnboardingChatMessage() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const listRef = useRef<LegendListRef>(null); // Ref for LegendList
  const headerHeight = Platform.OS === "ios" ? useHeaderHeight() : 0;

  const [messages, setMessages] = useState<MessageType[]>([]); // initialize a null messages state
  const [isProceedDisabled, setIsProceedDisabled] = useState(true);

  // load messages on mount
  //   useEffect(() => {
  //     loadMessages();
  //     setTimeout(() => {
  //       listRef.current?.scrollToEnd({
  //         animated: true,
  //       });
  //     }, 500);

  // scroll down to bottom on screen focus
  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    }, [])
  );

  const sendAiMessage = async function (
    aiSendingMessage: string,
    messageSendDelayMs: number // this is the time it takes the skeleton to become a message
  ) {
    // creating objects for user and ai's messages:

    const aiMessage: MessageType = {
      id: generateMessageId(),
      sender: "ai",
      content: "",
      $createdAt: getDate(),
      loading: true,
    };

    // update the messages immediately with the user's message + ai's message skeleton
    setMessages((prevMessages) => {
      return [...prevMessages, aiMessage];
    });

    // scroll after ai sends the message
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((message) => {
          if (message.id == aiMessage.id) {
            return { ...message, content: aiSendingMessage, loading: false };
          }
          return message;
        });

        return updatedMessages;
      });
    }, messageSendDelayMs);
  };

  // THE STRING OF MESSAGES WILL GO SOMETHING LIKE THIS:
  // AI: Hello there, wonderful person
  // AI: I am going to be your personal Habit Coach
  // Whatever you want to do, I want to help you do it
  // I will give you personalized recommendations everyday, which will help you identify what you're doing wrong, and what you're doing right and should do more of
  // I can also give you notifications to remind you to complete these habits
  // Let's now add some habits that you want to do

  useEffect(() => {
    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function sendOnboardingMessages() {
      // NOTE: the delay inside the sendAIMessage should be less than the sleep time
      // for smooth message sending

      // 1
      sendAiMessage("Hello there, wonderful person!", 1000);
      await sleep(2000);

      // 2
      sendAiMessage("I am going to be your Personal Habit Coach", 2000);
      await sleep(3500);

      // 3
      sendAiMessage(
        "Whatever habits you want to build, I will help you build them!",
        2000
      );
      await sleep(4000);

      // 4

      sendAiMessage(
        "I will give you personalized recommendations everyday, which will help you identify what you're doing right and what you're doing wrong",
        3000
      );
      await sleep(6000);

      sendAiMessage(
        "I can also give you notifications to remind you to complete these habits!",
        2000
      );
      await sleep(4000);

      sendAiMessage(
        "Let's now add some habits that you would like to do consistently",
        2000
      );
      await sleep(3000);
      setIsProceedDisabled(false);
    }
    sendOnboardingMessages();
  }, []);

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

          <View
            style={{
              borderWidth: 1,
              borderColor: "black",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              // marginBottom: 6,
              marginHorizontal: 14,
            }}
          >
            <CTAButton
              title={"Proceed"}
              onPress={() => {
                router.push("/(onboarding)/2");
              }}
              disabled={isProceedDisabled}
            />
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
