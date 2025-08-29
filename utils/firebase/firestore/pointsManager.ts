// utils/updateUserPoints.ts
import { getAuth } from "@react-native-firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  increment,
} from "@react-native-firebase/firestore";

/**
 * Updates the currently logged-in user's points.
 * @param {number} pointsToAdd - The number of points to add. Can be negative to subtract.
 */
export const updateUserPoints = async (pointsToAdd: number) => {
  const auth = getAuth();
  const firestore = getFirestore();

  // 1. Make sure a user is logged in
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is logged in to update points.");
    return;
  }

  // 2. Create a reference to the user's document
  const userDocRef = doc(firestore, "users", user.uid);

  try {
    // 3. Use updateDoc + increment to add the points
    await updateDoc(userDocRef, {
      points: increment(pointsToAdd),
    });
    console.log(
      `Successfully added ${pointsToAdd} points for user ${user.uid}`
    );
  } catch (error) {
    console.error("Error updating points: ", error);
  }
};
