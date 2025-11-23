import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Ionicons } from "@expo/vector-icons";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "@react-native-firebase/auth";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "96863368182-rqkal2eqcb3u8gealmbplpa66n5s8eu9.apps.googleusercontent.com",
      offlineAccess: false,
      scopes: ["profile", "email"],
      forceCodeForRefreshToken: false,
    });
  }, []);

  async function signIn() {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      console.log(
        "✔️ Google Sign-In Success:",
        JSON.stringify(userInfo, null, 2)
      );

      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error("No idToken returned from Google Sign-In");

      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(idToken);
      const firebaseUser = await signInWithCredential(auth, credential);

      console.log("🔥 Firebase Sign-In Success:", firebaseUser.user);

      setLoading(false);
      return firebaseUser;
    } catch (error: any) {
      setLoading(false);

      if (error && "code" in error) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("User cancelled the login flow");
            break;
          case statusCodes.IN_PROGRESS:
            console.log("Login already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available");
            break;
          default:
            console.log("Unhandled Google Sign-In error:", error);
        }
      } else {
        console.log("Unhandled error:", error);
      }
    }
  }

  return (
    <TouchableOpacity
      style={styles.customButton}
      onPress={signIn}
      disabled={loading}
    >
      <Ionicons name="logo-google" size={22} color="#000000" />
      <Text style={styles.buttonText}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </Text>
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
