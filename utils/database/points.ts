import { updateUserPointsInFirestore } from "../firebase/firestore/pointsManager";
import { syncDataToFirebaseProfile } from "../firebase/firestore/profileManager";
import mmkvStorage from "../mmkvStorage";

export function addPoints(addAmount: number) {
  try {
    let currentPoints = mmkvStorage.getNumber("totalPoints");
    if (currentPoints != undefined) {
      // if points are already initialized
      currentPoints += addAmount;
      mmkvStorage.set("totalPoints", currentPoints);
    } else {
      mmkvStorage.set("totalPoints", 0); // initialize mmkvStorage
      addPoints(addAmount); // recursively add points for the first time
    }

    // also add the points in firestore:
    syncDataToFirebaseProfile(); // just sync local points to firebase, dassit
  } catch (err) {
    console.log(
      "CRITICAL ERROR, COULD NOT ADD POINTS IN MMKV OR FIRESTORE",
      err
    );
  }
}

export function subtractPoints(subtractAmount: number) {
  try {
    let currentPoints = mmkvStorage.getNumber("totalPoints");
    if (currentPoints != undefined) {
      // if points are already initialized
      currentPoints -= subtractAmount;
      mmkvStorage.set("totalPoints", currentPoints);
    } else {
      mmkvStorage.set("totalPoints", 0); // initialize mmkvStorage (this case will never be hit, but just as a safety net)
      addPoints(subtractAmount); // recursively add points for the first time
    }

    // now, subtracting the points from firestore as well: (we just sync current points to firebase lol)
    syncDataToFirebaseProfile();
  } catch (err) {
    console.log(
      "CRITICAL ERROR, COULD NOT SUBTRACT POINTS FROM MMKV OR FIRESTORE",
      err
    );
  }
}

export function getPoints() {
  const points = mmkvStorage.getNumber("totalPoints");
  return points ? points : 0;
}
