export type FirebaseUserProfile = {
  nickname: string;
  points: number;
  pointsThisMonth: number;
  avatarIcon: string;
  profileCreationDate: string; // formattedDate
  enrolledInGlobal: boolean;
  totalHabitsCompleted?: number;
  streak?: number;
  error?: boolean;
};
