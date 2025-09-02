import { getAuth } from "@react-native-firebase/auth";
import functions from "@react-native-firebase/functions";
import { Alert } from "react-native";

export function getInviteLink(): string | null {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) throw new Error("User not authenticated to firebase");

    const inviteLink = `https://habitmentor.app/friend-invite?senderId=${currentUser.uid}`;
    return inviteLink;
  } catch (err) {
    console.log("CRITICAL ERROR: COULD NOT GENERATE INVITE LINK", err);
    return null;
  }
}

export async function handleSendFriendRequest(profileOwnerId: string) {
  try {
    console.log("eat it well and mix it up");
    const sendFriendRequest = functions().httpsCallable("sendFriendRequest");
    await sendFriendRequest({ recipientId: profileOwnerId });
    Alert.alert("Success", "Friend Request Sent!");
  } catch (err) {
    console.log("CRITICAL ERROR, UNABLE TO SEND FRIEND REQUEST", err);
    Alert.alert("Error", "Failed to send friend request");
  }
}

export async function handleAcceptFriendRequest(requestSenderId: string) {
  try {
    const respondToFriendRequest = functions().httpsCallable(
      "respondToFriendRequest"
    );
    await respondToFriendRequest({
      senderId: requestSenderId, // sender of the friiend request
      response: "accept",
    });

    Alert.alert("Success", "Friend Request Accepted!");
  } catch (err) {
    console.log("CRITICAL ERROR, COULD NOT ACCEPT FRIEND REQUEST", err);
    Alert.alert("Error", "Unable to accept friend request");
  }
}
