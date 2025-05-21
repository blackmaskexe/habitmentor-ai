interface MessageType {
  sender: String;
  content: String;
  $createdAt: Date;
}

interface HabitObject {
  frequency: boolean[];
  habitDescription: string;
  habitName: string;
  iconName: string;
  id: string;
  points: number;
  notificationId?: string;
}

interface FormValuesType {
  habitName?: string;
  habitDescription?: string;
  frequency?: boolean[];
  iconName?: string;
  id?: string;
  points?: number;
}

export type { MessageType, HabitObject, FormValuesType };
