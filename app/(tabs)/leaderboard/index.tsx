import * as React from "react";
import { View, useWindowDimensions, Text, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { useEffect, useState, useCallback } from "react";
import { SheetManager } from "react-native-actions-sheet";
import { useFocusEffect } from "expo-router";
import {
  onAuthStateChanged,
  FirebaseAuthTypes,
  getAuth,
} from "@react-native-firebase/auth";
import { getFirebaseUserId } from "@/utils/firebase/firestore/profileManager";

const FirstRoute = () => {
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null); // Default to null for clarity

  // function handleAuthStateChange(user: FirebaseAuthTypes.User) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // // This hook correctly subscribes to Firebase auth state changes.
  // useEffect(() => {
  //   const subscriber = onAuthStateChanged(
  //     getAuth(),
  //     handleAuthStateChange as any
  //   );

  //   return subscriber; // Unsubscribe on component unmount
  // }, []);

  // // 3. This new useEffect hook will react to auth state changes.

  // useFocusEffect(
  //   useCallback(() => {
  //     // We only want to run this logic after Firebase has initialized.
  //     if (!initializing) {
  //       // If there is no user, show the action sheet.
  //       if (!user) {
  //         SheetManager.show("leaderboard-sheet");
  //       } else {
  //         // If a user *is* logged in (e.g., they just signed in),
  //         // explicitly hide the sheet.
  //         SheetManager.hide("leaderboard-sheet");
  //       }
  //     }
  //   }, [user, initializing])
  // );

  const [initializing, setInitializing] = useState<boolean>(true);

  // what I want to happen:
  // cases:
  // first time user -> no userId in mmkv, no auth user = show entire action sheet
  // returning user -> yes userId, maybe no auth user? = show only login action sheet
  // chhapri user (did auth, but not went ahead with profile creation) = yes auth, no userId -> walk them through the entire process again\

  // getting user statuses at first boot of this screen:
  useFocusEffect(
    useCallback(() => {
      console.log("MAINE PELEE");
      const user = getAuth();
      const firebaseUserId = getFirebaseUserId();

      console.log("ee legal", user, firebaseUserId);
      if (user.currentUser && firebaseUserId) return; // early return, not to show anything
      SheetManager.show("login-sheet"); // show the entire login flow to the user
      // I'll manually hide the leaderboard-login-sheet from the sheet itself when the auth flow is complete
    }, [])
  );

  // placeholder
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.scene}>
      <Text style={styles.placeholderText}>Coming Soon</Text>
      {/* <AppleSignInButton /> */}
    </View>
  );
};

const SecondRoute = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.scene}>
      <Text style={styles.placeholderText}>Coming Soon</Text>
    </View>
  );
};

// const ThirdRoute = () => {
//   const theme = useTheme();
//   const styles = createStyles(theme);
//   return (
//     <View style={styles.scene}>
//       <Text style={styles.placeholderText}>Coming Soon</Text>
//     </View>
//   );
// };

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  // third: ThirdRoute,
});

export default function TabViewExample() {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: "first", title: "Friends" },
    { key: "second", title: "Global" },
    // { key: "third", title: "All-Time" },
  ];

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.background }}
      labelStyle={{ color: theme.colors.text }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.textSecondary}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    scene: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    placeholderText: {
      color: theme.colors.text,
      ...theme.text.h2,
    },
  });
}
