interface Message {
  messageSender: String;
  messageContent: String;
  createdAt: String;
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

export type { Message, HabitObject };
