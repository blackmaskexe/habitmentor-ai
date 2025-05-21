import { Ionicons } from "@expo/vector-icons";

interface MessageType {
  sender: String;
  content: String;
  $createdAt: Date;
}

interface HabitObject {
  frequency: boolean[];
  habitDescription: string;
  habitName: string;
  iconName: keyof typeof Ionicons.glyphMap | string; // Type for Ionicons, complicated but that's what is used
  id: string;
  points: number;
  notificationId?: string;
}

interface FormValuesType {
  habitName?: string;
  habitDescription?: string;
  frequency?: boolean[];
  iconName?: keyof typeof Ionicons.glyphMap | string;
  id?: string;
  points?: number;
}

export type { MessageType, HabitObject, FormValuesType };
