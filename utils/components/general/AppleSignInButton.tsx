// Example Usage on, say, a Login Screen:

// import React from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import AppleSignInButton from './AppleSignInButton'; // Adjust the path if needed

// const LoginScreen = () => {
//   // This function will be called from our button component on a successful sign-in
//   const handleSuccess = (user) => {
//     console.log("Login successful! User UID:", user.uid);
//     // Here you would navigate to the main part of your app
//     // e.g., navigation.replace('AppHome');
//     Alert.alert("Login Successful", `Welcome back!`);
//   };

//   const handleError = (error) => {
//     console.error("Sign-in error:", error);
//     // You can handle the error here if needed
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to HabitApp</Text>
//       <Text style={styles.subtitle}>Sign in to continue</Text>
//       <AppleSignInButton
//         onSignInSuccess={handleSuccess}
//         onSignInError={handleError}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 40,
//   },
// });

// export default LoginScreen;

import React from "react";
import { Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

// Import your Firebase auth and db instances
// import { auth, db } from "./firebaseConfig";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  OAuthProvider,
  signInWithCredential,
  getAdditionalUserInfo,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getPoints } from "@/utils/database/points";

const AppleSignInButton = ({ onSignInSuccess, onSignInError }: any) => {
  const handleAppleSignIn = async () => {
    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken as any,
        rawNonce: nonce,
      });

      const result = await signInWithCredential(auth, credential);
      const info = getAdditionalUserInfo(result);

      console.log(
        "Successfully signed into Firebase Auth. UID:",
        result.user.uid
      );
      console.log("Is this a new user?", info?.isNewUser);

      if (info && info.isNewUser) {
        const userDocRef = doc(db, "users", result.user.uid);
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          nickname: result.user.displayName || "New User",
          avatarIcon: "default_icon_name",
          points: getPoints(),
          createdAt: serverTimestamp(),
        });
      }

      // Call the success callback with the user object
      if (onSignInSuccess) {
        onSignInSuccess(result.user);
      }
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log("User canceled Apple Sign-In.");
      } else {
        console.error("Apple Sign-In Error:", e);
        Alert.alert("Error", "An error occurred during sign-in.");
        // Call the error callback
        if (onSignInError) {
          onSignInError(e);
        }
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 250, height: 50 }} // You can pass style as a prop too
      onPress={handleAppleSignIn}
    />
  );
};

export default AppleSignInButton;
