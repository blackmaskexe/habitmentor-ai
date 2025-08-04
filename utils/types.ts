import { Ionicons } from "@expo/vector-icons";

interface MessageType {
  id: string;
  sender: string;
  content: string;
  $createdAt: Date;
  loading: boolean;
  additionalData?: {
    actionableSteps?: string[];
  };
}

interface HabitObject {
  frequency: boolean[];
  habitDescription: string;
  habitName: string;
  iconName: keyof typeof Ionicons.glyphMap | string; // Type for Ionicons, complicated but that's what is used
  id: string;
  points: number;
  notificationIds?: string[];
  notificationTime?: string; // formattedTime (see date.ts)
  isNotificationOn: boolean;
  startDate?: string; // formattedDate (see date.ts)
  tags?: string[];
}

interface FormValuesType {
  habitName?: string;
  habitDescription?: string;
  frequency?: boolean[];
  iconName?: keyof typeof Ionicons.glyphMap | string;
  id?: string;
  points?: number;
  startDate?: string; // formattedDate
}

interface UserChatRequestType {
  message: string;
  importantMessageHistory?: string[];
  recentMissedHabits?: string[];
  timeOfDay?: "morning" | "afternoon" | "evening";
  proActive: boolean;
}

export type { MessageType, HabitObject, FormValuesType, UserChatRequestType };
