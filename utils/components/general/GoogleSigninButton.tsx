import React from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { useTheme } from "@/utils/theme/ThemeContext";

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
    <GoogleSigninButton
      style={{
        width: "90%", // Match your Apple button style
        height: 50,
      }}
      size={GoogleSigninButton.Size.Wide}
      // The button color adapts to your theme, just like the Apple button
      color={
        theme.theme === "dark"
          ? GoogleSigninButton.Color.Light
          : GoogleSigninButton.Color.Dark
      }
      onPress={() =>
        onGoogleButtonPress().then(() =>
          console.log("Google sign-in complete!")
        )
      }
    />
  );
}
