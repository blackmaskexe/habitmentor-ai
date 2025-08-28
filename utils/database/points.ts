import mmkvStorage from "../mmkvStorage";

export function addPoints(addAmount: number) {
  let currentPoints = mmkvStorage.getNumber("totalPoints");
  if (currentPoints != undefined) {
    // if points are already initialized
    currentPoints += addAmount;
    mmkvStorage.set("totalPoints", currentPoints);
  } else {
    mmkvStorage.set("totalPoints", 0); // initialize mmkvStorage
    addPoints(addAmount); // recursively add points for the first time
  }
}

export function subtractPoints(subtractAmount: number) {
  let currentPoints = mmkvStorage.getNumber("totalPoints");
  if (currentPoints != undefined) {
    // if points are already initialized
    currentPoints -= subtractAmount;
    mmkvStorage.set("totalPoints", currentPoints);
  } else {
    mmkvStorage.set("totalPoints", 0); // initialize mmkvStorage (this case will never be hit, but just as a safety net)
    addPoints(subtractAmount); // recursively add points for the first time
  }
}

export function getPoints() {
  const points = mmkvStorage.getNumber("totalPoints");
  return points ? points : 0;
}
