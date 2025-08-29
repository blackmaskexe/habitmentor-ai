export type LeaderboardAvatarIcon =
  | "smile"
  | "happy"
  | "i don't know what else";

export type FirebaseUserProfile = {
  nickname: string;
  points: number;
  pointsThisMonth: number;
  avatarIcon: LeaderboardAvatarIcon;
  friends: string[];
  profileCreationDate: string; // formattedDate
};
