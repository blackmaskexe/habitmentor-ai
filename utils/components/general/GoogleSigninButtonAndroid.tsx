import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Ionicons } from "@expo/vector-icons";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "96863368182-rqkal2eqcb3u8gealmbplpa66n5s8eu9.apps.googleusercontent.com",
      offlineAccess: false,
      scopes: ["profile", "email"],
      forceCodeForRefreshToken: false, // Android only
    });
  }, []);

  async function signIn() {
    try {
      setLoading(true);

      // Ensure Play Services exist
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Attempt sign-in
      const userInfo = await GoogleSignin.signIn();
      console.log("✔️ Google Sign-In Success:", userInfo);

      setLoading(false);
      return userInfo;
    } catch (error: any) {
      setLoading(false);
      console.log("❌ Google Sign-In Error:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Login already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available");
      } else {
        console.log("Unhandled error:", error);
      }
    }
  }

  return (
    <TouchableOpacity
      style={styles.customButton}
      onPress={() => {
        signIn().then(() => {
          console.log("Sign in process completed hehe");
        });
      }}
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
