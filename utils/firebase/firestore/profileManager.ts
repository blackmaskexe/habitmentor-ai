import mmkvStorage from "@/utils/mmkvStorage";
import firestore from "@react-native-firebase/firestore";
import { FirebaseUserProfile, LeaderboardAvatarIcon } from "../types";
import { getPoints } from "@/utils/database/points";
import { getFormattedDate } from "@/utils/date";

const usersCollection = firestore().collection("Users");

// ----------------------------------------
// FIRESTORE USER ID STORING IN MMKVSTORAGE
// ----------------------------------------

export function getFirebaseUserId(): string | null {
  const firebaseUserId = mmkvStorage.getString("firebaseUserId");
  return firebaseUserId ? firebaseUserId : null;
}

function setFirebaseUserId(userId: string): void {
  if (userId) mmkvStorage.set("firebaseUserId", userId);
}

// ------------------------------------
// FIRESTORE USER CREATION AND UPDATION
// ------------------------------------

export async function createProfile(
  nickname: string,
  avatarIcon: LeaderboardAvatarIcon
) {
  try {
    if (getFirebaseUserId()) return; // early return if the user already has a profile in firebase

    const firebaseUserProfile: FirebaseUserProfile = {
      nickname: nickname,
      avatarIcon: avatarIcon,
      points: getPoints(),
      pointsThisMonth: 0,
      friends: [],
      profileCreationDate: getFormattedDate(),
    };

    const profileReference = await usersCollection.add(firebaseUserProfile);
    setFirebaseUserId(profileReference.id);
  } catch (err) {
    console.log("CRITICAL ERROR: FAILED TO CREATE FIREBASE PROFILE", err);
  }
}

export async function updateProfile(
  userId: string,
  nickname: string,
  avatarIcon: LeaderboardAvatarIcon
) {
  try {
    await usersCollection.doc(userId).update({
      nickname: nickname,
      avatarIcon: avatarIcon,
    });
  } catch (err) {
    console.log("CRITICAL ERROR: FAILED TO UPDATE FIREBASE PROFILE", err);
  }
}
