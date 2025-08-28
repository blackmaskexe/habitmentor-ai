import * as React from "react";
import { View, useWindowDimensions, Text, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import AppleSignInButton from "@/utils/components/general/AppleSignInButton";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import { auth } from "@/utils/firebase/firebaseConfig";
import { SheetManager } from "react-native-actions-sheet";
import { useFocusEffect } from "expo-router";

const FirstRoute = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This listener runs when the app starts and whenever the auth state changes
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUser(authenticatedUser as any);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        SheetManager.show("leaderboard-sheet");
      } else {
        SheetManager.hide("leaderboard-sheet");
      }
    }, [])
  );

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
