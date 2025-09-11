import { getDate } from "../date";
import { updateUserPointsInFirestore } from "../firebase/firestore/pointsManager";
import { syncDataToFirebaseProfile } from "../firebase/firestore/profileManager";
import mmkvStorage from "../mmkvStorage";

// WHY SCRAPPING "POINTS THIS MONTH":
// users need to log in to update their scoreboard
// I would need to move the logic of checking points to the server
// and I don't have the energy to do that just yet
// so I'm just delaying / putting off this feature for now

// OR Alternative Idea:
// I could manually reset all points to 0 (total points) from backend
// nahh, that would be bad for long term users (pretty much me sadge but I'll try my best to get this app "out there")
// look at me talking to myself while I write some computer code lol

export function addPoints(addAmount: number) {
  try {
    // Logic for TOTAL points:
    let currentPoints = mmkvStorage.getNumber("totalPoints");
    if (currentPoints != undefined) {
      // if points are already initialized
      currentPoints += addAmount;
      mmkvStorage.set("totalPoints", currentPoints);
    } else {
      mmkvStorage.set("totalPoints", 0); // initialize mmkvStorage
      addPoints(addAmount); // recursively add points for the first time
    }

    // Logic for THIS MONTH points: WILL ADD IN FUTURE
    // addPointsThisMonth(addAmount);

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
    // Logic for TOTAL points:
    let currentPoints = mmkvStorage.getNumber("totalPoints");
    if (currentPoints != undefined) {
      // if points are already initialized
      currentPoints -= subtractAmount;
      mmkvStorage.set("totalPoints", currentPoints);
    } else {
      mmkvStorage.set("totalPoints", 0); // initialize mmkvStorage (this case will never be hit, but just as a safety net)
      addPoints(subtractAmount); // recursively add points for the first time
    }

    // Logic for THIS MONTH points: WILL ADD IN FUTURE
    // addPointsThisMonth(-1 * subtractAmount);

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

export function getPointsThisMonth() {
  return mmkvStorage.getNumber("pointsThisMonth") || 0;
}

export function addPointsThisMonth(addAmount: number) {
  try {
    // finding to see if it is the month the points were being put into the
    // "This Month" basket:
    const currentMonth = getDate().getMonth();
    const lastPointSetMonth =
      mmkvStorage.getNumber("pointStoreMonth") || currentMonth;

    // if current month and the last point set month are the same
    // then keep adding the points in the same basket
    // otherwise reset points to 0 first, then add

    if (currentMonth == lastPointSetMonth) {
      const updatedPoints = getPointsThisMonth() + addAmount;
      mmkvStorage.set("pointsThisMonth", updatedPoints);
    } else {
      // changing the date of last collection to this month:
      mmkvStorage.set("pointStoreMonth", currentMonth);

      // setting pointsThisMonth to 0:
      // mmkvStorage.set("pointsThisMonth", 0); // this was redundant so removing
      // then adding points:
      mmkvStorage.set("pointsThisMonth", addAmount);
    }
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT SET POINTS THIS MONTH", err);
  }
}
