// TODO: MAKE IT LIKE AN AI IS CHATTING WITH YOU,
// TELLING YOU THE FEATURES OF THE APP,
// AND TELLING YOU THE MAIN GIST OF THE APP

import OnboardingChatMessage from "@/utils/components/specific/OnboardingChatMessage";

// THE STRING OF MESSAGES WILL GO SOMETHING LIKE THIS:
// AI: Hello there, wonderful person
// AI: I am going to be your personal Habit Coach
// Whatever you want to do, I want to help you do it
// I will give you personalized recommendations everyday, which will help you identify what you're doing wrong, and what you're doing right and should do more of
// I can also give you notifications to remind you to complete these habits
// Let's now add some habits that you want to do

export default function UserOnboardingChat() {
  return <OnboardingChatMessage />;
}
