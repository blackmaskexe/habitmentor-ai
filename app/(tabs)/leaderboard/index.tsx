import * as React from "react";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { useFocusEffect } from "expo-router";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import {
  getMmkvUserLeaderboardProfile,
  getUserProfile,
  setMmkvUserLeaderboardProfile,
} from "@/utils/firebase/firestore/profileManager";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import mmkvStorage from "@/utils/mmkvStorage";
import LeaderboardFriendsView from "@/utils/components/specific/LeaderboardFriendsView";
import LeaderboardGlobalView from "@/utils/components/specific/LeaderboardGlobalView";
import { useLoginSheet } from "@/utils/contexts/LoginSheetContext";

const FirstRoute = () => {
  // This state tracks the initial check of the user's auth status.
  const [initializing, setInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(
    null
  );
  const theme = useTheme();
  const styles = createStyles(theme);

  const { openLoginSheet } = useLoginSheet();

  useFocusEffect(
    useCallback(() => {
      // This listener handles the user's authentication state.
      const authSubscriber = onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          // If the user is authenticated, we try to get their profile.
          // First, check local storage for a quick load.
          // If it's not there, fetch from Firestore as a fallback.
          const profile = getMmkvUserLeaderboardProfile();

          if (!profile) {
            // the profile in mmkvstorage is null, doesn't translate to user not having
            // a profile at all, so we check for that:
            // if the profile is null, we check firebase if there exists a profile
            const fetchedProfile = await getUserProfile(user.uid);
            if (fetchedProfile.error) {
              // this is the case where the user does NOT have a profile,
              // and they should register for one:
              setUserProfile(null);
              openLoginSheet();
            } else {
              setUserProfile(fetchedProfile);
              setMmkvUserLeaderboardProfile(fetchedProfile);
            }
          } else {
            // Profile exists in MMKV, use it
            setUserProfile(profile);
          }
        } else {
          // If user is null, they are signed out. Clear the profile and show the login sheet.
          setUserProfile(null);
          openLoginSheet();
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

  // 2. Pass the userProfile to LeaderboardFriendsView
  return <LeaderboardFriendsView userProfile={userProfile} />;
};

const SecondRoute = () => {
  // This state tracks the initial check of the user's auth status.
  const [initializing, setInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(
    null
  );
  const theme = useTheme();
  const styles = createStyles(theme);
  const { openLoginSheet } = useLoginSheet();

  useFocusEffect(
    useCallback(() => {
      // This listener handles the user's authentication state.
      const authSubscriber = onAuthStateChanged(getAuth(), async (user) => {
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
            openLoginSheet();
          }
        } else {
          // If user is null, they are signed out. Clear the profile and show the login sheet.
          setUserProfile(null);
          openLoginSheet();
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

  // 2. Pass the userProfile to LeaderboardGlobalView
  return <LeaderboardGlobalView userProfile={userProfile} />;
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
