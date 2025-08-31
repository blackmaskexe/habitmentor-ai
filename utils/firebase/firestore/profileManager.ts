import mmkvStorage from "@/utils/mmkvStorage";
import firestore from "@react-native-firebase/firestore";
import { FirebaseUserProfile } from "../types";
import { getPoints } from "@/utils/database/points";
import { getFormattedDate } from "@/utils/date";
import { getAuth } from "@react-native-firebase/auth";

const usersCollection = firestore().collection("users");

// ----------------------------------------
// FIRESTORE USER ID STORING IN MMKVSTORAGE
// ----------------------------------------

export function getUserLeaderboardProfile(): FirebaseUserProfile | null {
  try {
    const leaderboardProfile = JSON.parse(
      mmkvStorage.getString("leaderboardProfile") || ""
    );

    if (!leaderboardProfile) {
      return null;
    }
    return leaderboardProfile as FirebaseUserProfile;
  } catch (err) {
    console.log("CANNOT GET USER PROFILE FROM MMKV", err);
    return null;
  }
}

export function setUserLeaderboardProfile(userProfile: FirebaseUserProfile) {
  mmkvStorage.set("leaderboardProfile", JSON.stringify(userProfile));
}

// ------------------------------------
// FIRESTORE USER CREATION AND UPDATION
// ------------------------------------

// create a firebase user profile, return true or false based on if the profile was
// created or not
export async function createProfile(
  nickname: string,
  avatarIcon: string
): Promise<boolean> {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      throw new Error("NOT SIGNED INTO FIREBASE AUTH");
    }

    const userDocRef = usersCollection.doc(currentUser.uid);
    const docSnapshot = await userDocRef.get();

    // checking if the docsnapshot (user's profile) already exists:
    if (docSnapshot.exists()) {
      const userProfileData = docSnapshot.data() as FirebaseUserProfile;
      setUserLeaderboardProfile(userProfileData);
      return false; // return false for profile not created
    }

    const firebaseUserProfile: FirebaseUserProfile = {
      nickname: nickname,
      avatarIcon: avatarIcon,
      points: getPoints(),
      pointsThisMonth: 0,
      friends: [],
      profileCreationDate: getFormattedDate(),
    };

    await userDocRef.set(firebaseUserProfile);
    setUserLeaderboardProfile(firebaseUserProfile);

    return true; // returning true for profile created
  } catch (err) {
    console.log("CRITICAL ERROR: FAILED TO CREATE FIREBASE PROFILE", err);
    return false; // returning false for profile not created
  }
}

export async function updateProfile(nickname: string, avatarIcon: string) {
  try {
    const currentUser = getAuth().currentUser;
    await usersCollection.doc(currentUser?.uid).update({
      nickname: nickname,
      avatarIcon: avatarIcon,
    });
  } catch (err) {
    console.log("CRITICAL ERROR: FAILED TO UPDATE FIREBASE PROFILE", err);
  }
}

export async function doesUserHaveFirebaseProfile(): Promise<boolean> {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      // If no user is logged in, they don't have a profile.
      return false;
    }

    const userDocRef = usersCollection.doc(currentUser.uid);
    const docSnapshot = await userDocRef.get();

    return docSnapshot.exists();
  } catch (error) {
    console.error("Error checking for user profile:", error);
    // It's safer to assume no profile exists if an error occurs.
    return false;
  }
}
