import mmkvStorage from "@/utils/mmkvStorage";
import firestore from "@react-native-firebase/firestore";

const usersCollection = firestore().collection("Users");

function getFirebaseUserId(): string | null {
  const firebaseUserId = mmkvStorage.getString("firebaseUserId");
  return firebaseUserId ? firebaseUserId : null;
}

function setFirebaseUserId(userId: string): void {
  if (userId) mmkvStorage.set("firebaseUserId", userId);
}

export async function createProfile() {
  try {
    if (getFirebaseUserId()) return; // early return if the user already has a profile in firebase

    const profileReference = await usersCollection.add({
      // the user's profile things here, validated by typescript
    });
    setFirebaseUserId(profileReference.id);
  } catch (err) {
    console.log("CRITICAL ERROR: FAILED TO CREATE FIREBASE PROFILE", err);
  }
}
