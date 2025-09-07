import mmkvStorage from "@/utils/mmkvStorage";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  addDoc,
  updateDoc,
  doc,
  setDoc,
} from "@react-native-firebase/firestore";
import { FirebaseUserProfile } from "../types";
import { getPoints } from "@/utils/database/points";
import { getFormattedDate } from "@/utils/date";
import { getAuth } from "@react-native-firebase/auth";
import { calculateLongestStreak } from "@/app/(tabs)/home/overview";
import { getTotalHabitsCompleted } from "@/utils/habits";
import { Filter } from "bad-words";

const filter = new Filter();
const db = getFirestore();

// const usersCollection = firestore().collection("users");

// ----------------------------------------
// FIRESTORE USER ID STORING IN MMKVSTORAGE
// ----------------------------------------

export function getMmkvUserLeaderboardProfile(): FirebaseUserProfile | null {
  try {
    const leaderboardProfile: FirebaseUserProfile = JSON.parse(
      mmkvStorage.getString("leaderboardProfile") || "{}"
    );

    if (!leaderboardProfile || !leaderboardProfile.nickname) {
      return null;
    }
    return leaderboardProfile as FirebaseUserProfile;
  } catch (err) {
    console.log("CANNOT GET USER PROFILE FROM MMKV", err);
    return null;
  }
}

export function setMmkvUserLeaderboardProfile(
  userProfile: FirebaseUserProfile
) {
  mmkvStorage.set("leaderboardProfile", JSON.stringify(userProfile));
}

// --------------------------------
// VALIDATOR FOR FIRESTORE NICKNAME
// --------------------------------

export function validateFirestoreNickname(nickname: string) {
  const response = {
    valid: true,
    messages: [] as string[],
  };

  // profanity check
  if (filter.isProfane(nickname)) {
    response.valid = false;
    response.messages.push("Please keep it PG Friendly 😡");
  }

  // crazy symbols check
  const allowedPattern = /^[a-zA-Z0-9_\s-]+$/;
  if (!allowedPattern.test(nickname)) {
    (response.valid = false),
      response.messages.push(
        "Only letters, numbers, spaces, hyphens, and underscores allowed"
      );
  }

  // length check
  if (nickname.length > 16 || nickname.length < 4) {
    response.valid = false;
    response.messages.push("Please keep the name between 4 and 16 characters");
  }

  // reserved words:
  const reservedWords = [
    "admin",
    "administrator",
    "mod",
    "moderator",
    "system",
    "bot",
    "habitmentor",
    "support",
    "help",
    "api",
    "null",
    "undefined",
    "deleted",
    "anonymous",
    "guest",
    "user",
    "test",
  ];
  if (reservedWords.includes(nickname.toLowerCase())) {
    response.valid = false;
    response.messages.push("This nickname is reserved and cannot be used");
  }

  // shouldn't be all numbers
  if (/^\d+$/.test(nickname)) {
    response.valid = false;
    response.messages.push("Nickname cannot be only numbers");
  }

  return response;
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
    console.log("I want to be your vaccum meter");
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      throw new Error("NOT SIGNED INTO FIREBASE AUTH");
    }

    // const userDocRef = usersCollection.doc(currentUser.uid);
    const userDocRef = doc(db, "users", currentUser.uid);
    const docSnapshot = await getDoc(userDocRef);

    // checking if the docsnapshot (user's profile) already exists:
    if (docSnapshot.exists()) {
      const userProfileData = docSnapshot.data() as FirebaseUserProfile;
      setMmkvUserLeaderboardProfile(userProfileData);
      return false; // return false for profile not created
    }

    const firebaseUserProfile: FirebaseUserProfile = {
      nickname: nickname,
      avatarIcon: avatarIcon,
      points: getPoints(),
      pointsThisMonth: 0,
      profileCreationDate: getFormattedDate(),
      enrolledInGlobal: false,
    };

    // await userDocRef.set(firebaseUserProfile);
    await setDoc(doc(db, "users", currentUser.uid), firebaseUserProfile);
    setMmkvUserLeaderboardProfile(firebaseUserProfile);

    console.log("I want to be your ford cortina");

    return true; // returning true for profile created
  } catch (err) {
    console.log("CRITICAL ERROR: FAILED TO CREATE FIREBASE PROFILE", err);
    return false; // returning false for profile not created
  }
}

export async function updateProfile(nickname: string, avatarIcon: string) {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      return;
    }
    // await usersCollection.doc(currentUser?.uid).update({
    //   nickname: nickname,
    //   avatarIcon: avatarIcon,
    // });
    await updateDoc(doc(db, "users", currentUser.uid), {
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

    const userDocRef = doc(db, "users", currentUser.uid);
    const docSnapshot = await getDoc(userDocRef);

    return docSnapshot.exists();
  } catch (error) {
    console.error("Error checking for user profile:", error);
    // It's safer to assume no profile exists if an error occurs.
    return false;
  }
}

export async function getUserProfile(
  userId: string
): Promise<FirebaseUserProfile> {
  try {
    // const userDocSnapshot = await usersCollection.doc(userId).get();
    const userDocSnapshot = await getDoc(doc(db, "users", userId));
    if (userDocSnapshot.exists()) {
      const userProfile = userDocSnapshot.data() as FirebaseUserProfile;
      return userProfile;
    } else throw new Error("User does not exist");
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT GET USER PROFILE", err);
    return {
      nickname: "Profile not found",
      points: 0,
      pointsThisMonth: 0,
      avatarIcon: "does-not-exist-questionmark",
      profileCreationDate: "1990-1-1",
      enrolledInGlobal: false,
    };
  }
}

export async function syncDataToFirebaseProfile() {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return; // early return if not auth

    // await usersCollection.doc(currentUser.uid).update({
    //   points: getPoints(),
    //   streak: await calculateLongestStreak(),
    //   totalHabitsCompleted: getTotalHabitsCompleted(),
    // });

    await updateDoc(doc(db, "users", currentUser.uid), {
      points: getPoints(),
      streak: await calculateLongestStreak(),
      totalHabitsCompleted: getTotalHabitsCompleted(),
    });

    console.log("User data updated!");
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT SYNC DATA TO FIREBASE PROFILE", err);
  }
}
