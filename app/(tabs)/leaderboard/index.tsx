import { getUserLeaderboardProfile } from "@/utils/firebase/firestore/profileManager";
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
  const [initializing, setInitialzing] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [friends, setFriends] = useState(null);

  // getting user statuses at first boot of this screen:
  useFocusEffect(
    useCallback(() => {
      async function showFriendsLeaderboard() {
        // await fetching all friends from firestore, then setFriends()
        // setInitializing(false) to stop the loading wheel
        setInitialzing(false);

        // once the initializing is true, we conditionally display mapped friends
      }
      const user = getAuth();

      if (user.currentUser && getUserLeaderboardProfile()) {
        // the user is authenticated right now, and set to go
        // what we want to do is:
        // 1. show a loading while stuff loads from firestore
        // 2. show all of the user's friends in the leaderboard once loaded
        showFriendsLeaderboard();
        return;
      } // early return, not to show anything
      SheetManager.show("login-sheet"); // show the entire login flow to the user
      // I'll manually hide the leaderboard-login-sheet from the sheet itself when the auth flow is complete
    }, [userProfile])
  );

  // placeholder
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.scene}>
      {initializing && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
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
