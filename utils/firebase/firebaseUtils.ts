import mmkvStorage from "../mmkvStorage";

export function getPersistentAuthUser() {
  const authUser = mmkvStorage.getString("firebaseUser");
  return authUser ? JSON.parse(authUser) : null;
}

export function setPersistentAuthUser(user: any) {
  mmkvStorage.set("firebaseUser", JSON.stringify(user));
}
