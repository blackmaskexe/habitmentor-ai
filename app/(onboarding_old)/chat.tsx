import OnboardingChatMessages from "@/utils/components/specific/OnboardingChat";

const testMesasges = [
  {
    messageType: 'chat',
    sender: "system",
    content: "So you downloaded this app because you want to start doing better habits?",
    $createdAt: new Date(Date.now() - 10 * 60 * 1001).toISOString(), // 10 minutes ago
  },
  
];

export default function Chat() {
  return <OnboardingChatMessages />
}

// what I'm trying to implement:
// 1. ai says what this app is about in a few sentences
// the user gets a forced option that only has the option of yes