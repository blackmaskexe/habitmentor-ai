import React from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { useTheme } from "@/utils/theme/ThemeContext";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GoogleSignInButton() {
  const theme = useTheme();

  async function onGoogleButtonPress() {
    try {
      // 1. Check if your device has Google Play Services installed (required for Android)
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. Trigger the native Google sign-in flow
      await GoogleSignin.signIn();

      // 3. Get the ID token from the signed-in user
      const { idToken } = await GoogleSignin.getTokens();

      // 4. Create a Firebase credential with the Google ID token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // 5. Sign-in the user with the credential
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Google sign-in was cancelled by the user.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Google sign-in is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("Google Play Services not available or outdated.");
      } else {
        console.error("Google Sign-In Error:", error);
      }
    }
  }

  return (
    <TouchableOpacity
      style={styles.customButton}
      onPress={() =>
        onGoogleButtonPress().then(() =>
          console.log("Google sign-in complete!")
        )
      }
    >
      <Ionicons name="logo-google" size={22} color="#000000" />
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 50,
    width: "90%",
    borderRadius: 6,
  },
  buttonText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 10,
  },
});
