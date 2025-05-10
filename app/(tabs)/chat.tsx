import ChatMessages from "@/utils/components/general/ChatMessage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const Chat = () => {
  const { initialMessage } = useLocalSearchParams();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ChatMessages
      messagesArray={[
        {
          sender: "ai",
          content: "Unun how can I help you today?",
          $createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 60 minutes ago
        },
        {
          sender: "user",
          content:
            "I've been feeling a bit lost lately, like I'm in a new place.",
          $createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(), // 55 minutes ago
        },
        {
          sender: "ai",
          content:
            "I understand. Sometimes it feels like 'this ain't the life that I'm used to,' right? What's on your mind specifically?",
          $createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(), // 50 minutes ago
        },
        {
          sender: "user",
          content:
            "Yeah, exactly. I'm trying to adapt, but it's challenging. Thinking about making some big changes.",
          $createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        },
        {
          sender: "ai",
          content:
            "Change can be like stepping into 'Kiss Land' – unfamiliar but full of potential. What kind of changes are you considering?",
          $createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 minutes ago
        },
        {
          sender: "user",
          content:
            "Mostly career stuff. I feel like I belong to the world, you know? But I'm not sure which path to take.",
          $createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
        },
        {
          sender: "ai",
          content:
            "That's a powerful feeling. 'Belong to the World' captures that ambition. We can explore some options if you'd like. Or perhaps you just need to 'Tears in the Rain' it out sometimes?",
          $createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        },
        {
          sender: "user",
          content:
            "Haha, maybe a bit of both. I also heard 'The Town' is a good place for new beginnings?",
          $createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
        },
        {
          sender: "ai",
          content:
            "It can be, but remember, 'pretty' much anywhere can be what you make of it. Focus on what drives you professionally.",
          $createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
        },
        {
          sender: "user",
          content:
            "Thanks, that's helpful. I just don't want to 'Wanderlust' aimlessly.",
          $createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        },
        {
          sender: "ai",
          content:
            "Precisely. Let's define some goals. What's one thing you'd love to achieve, even if it feels like a 'Professional' long shot right now?",
          $createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        },
      ]}
      tooltips={[
        "Buy a unun",
        "Sell a unun",
        "Dap up a unun",
        "Get a unun pass",
      ]}
      initialMessage={(initialMessage as any) || ""}
    />
  );
};

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {},

    text: {},
  });
}

export default Chat;
