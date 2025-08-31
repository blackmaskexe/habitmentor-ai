import { getAuth } from "@react-native-firebase/auth";

export function getInviteLink(): string | null {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) throw new Error("User not authenticated to firebase");

    const inviteLink = `habitapp://friend-invite?senderId=${currentUser.uid}`;
    return inviteLink;
  } catch (err) {
    console.log("CRITICAL ERROR: COULD NOT GENERATE INVITE LINK", err);
    return null;
  }
}

export async function getAllFriendsLeaderboardProfile() {}
