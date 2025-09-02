export type FirebaseUserProfile = {
  nickname: string;
  points: number;
  pointsThisMonth: number;
  avatarIcon: string;
  friends: string[];
  profileCreationDate: string; // formattedDate
  enrolledInGlobal: boolean;
};
