import {
  getMmkvUserLeaderboardProfile,
  getUserProfile,
} from "@/utils/firebase/firestore/profileManager";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import mmkvStorage from "@/utils/mmkvStorage";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { getAuth } from "@react-native-firebase/auth";
import { useFocusEffect } from "expo-router";
import * as React from "react";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

const FirstRoute = () => {
  // This state tracks the initial check of the user's auth status.
  const [initializing, setInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(
    null
  );
  const [friends, setFriends] = useState(null);
  const theme = useTheme();
  const styles = createStyles(theme);

  useFocusEffect(
    useCallback(() => {
      // This listener handles the user's authentication state.
      const authSubscriber = getAuth().onAuthStateChanged(async (user) => {
        if (user) {
          // If the user is authenticated, we try to get their profile.
          // First, check local storage for a quick load.
          // If it's not there, fetch from Firestore as a fallback.
          const profile =
            getMmkvUserLeaderboardProfile() ?? (await getUserProfile(user.uid));

          // Set the profile state. If no profile was found, this will be null.
          setUserProfile(profile);
          // If no profile was found even for a logged-in user, they need to create one.
          if (!profile) {
            SheetManager.show("login-sheet");
          }
        } else {
          // If user is null, they are signed out. Clear the profile and show the login sheet.
          setUserProfile(null);
          SheetManager.show("login-sheet");
        }
        // The authentication check is complete, so we can stop the loading spinner.
        setInitializing(false);
      });

      // This listener updates the UI if the profile changes in local storage.
      const mmkvListener = mmkvStorage.addOnValueChangedListener(
        (changedKey) => {
          if (changedKey === "leaderboardProfile") {
            setUserProfile(getMmkvUserLeaderboardProfile());
          }
        }
      );

      // The cleanup function unsubscribes from listeners when the screen loses focus.
      return () => {
        authSubscriber();
        mmkvListener.remove();
      };
    }, [])
  );

  // 1. While the initial auth check is running, show a loading spinner.
  if (initializing) {
    return (
      <View style={styles.scene}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // 2. If the check is done and we have a user profile, show the friends list.
  if (userProfile) {
    return (
      <View style={styles.scene}>
        {friends ? (
          <Text>Friends list will go here.</Text>
        ) : (
          <Text style={styles.placeholderText}>
            You don't have any friends yet!
          </Text>
        )}
      </View>
    );
  }

  // 3. If the check is done and there's no profile, the user needs to log in.
  // The login sheet is already handled by the effect.
  return (
    <View style={styles.scene}>
      <Text style={styles.placeholderText}>
        Please log in to see your friends.
      </Text>
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
