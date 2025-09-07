import { useTheme } from "@/utils/theme/ThemeContext";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import {
  AppleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import React from "react";
import { Platform } from "react-native";

export default function AppleSignInButton() {
  // return empty component if not on ios:
  if (Platform.OS != "ios") {
    return <></>;
  }

  const theme = useTheme();
  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("Apple Sign-In failed - no identify token returned");
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

    // Sign the user in with the credential
    return signInWithCredential(getAuth(), appleCredential);
  }

  return (
    <AppleButton
      buttonStyle={
        theme.theme == "dark"
          ? AppleButton.Style.WHITE
          : AppleButton.Style.BLACK
      }
      buttonType={AppleButton.Type.SIGN_IN}
      style={{
        width: "90%",
        height: 50,
        marginBottom: theme.spacing.s,
      }}
      onPress={() =>
        onAppleButtonPress().then(() => console.log("Apple sign-in complete!"))
      }
    />
  );
}

// Apple also requires that the app revoke the Sign in with Apple token when the user chooses to delete their account. This can be accomplished with the revokeToken API.

// import { getAuth, revokeToken } from '@react-native-firebase/auth';
// import { appleAuth } from '@invertase/react-native-apple-authentication';

// async function revokeSignInWithAppleToken() {
//   // Get an authorizationCode from Apple
//   const { authorizationCode } = await appleAuth.performRequest({
//     requestedOperation: appleAuth.Operation.REFRESH,
//   });

//   // Ensure Apple returned an authorizationCode
//   if (!authorizationCode) {
//     throw new Error('Apple Revocation failed - no authorizationCode returned');
//   }

//   // Revoke the token
//   return revokeToken(getAuth(), authorizationCode);
// }
