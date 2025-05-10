// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { useTheme } from "@/utils/theme/ThemeContext";

// export default function Index() {
//   const theme = useTheme();
//   const styles = createStyles(theme);
//   return (
//     <ScrollView style={styles.scrollView}>
//       <View style={styles.container}>
//         <Text style={styles.text}>Hello, World From Progress!</Text>
//       </View>
//     </ScrollView>
//   );
// }
// function createStyles(theme: any) {
//   return StyleSheet.create({
//     scrollView: {
//       flex: 1,
//       backgroundColor: theme.colors.background,
//     },
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100%",
//     },
//     text: {
//       ...theme.text.h2,
//     },
//   });
// }

import * as React from "react";
import { View, useWindowDimensions, Text, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTheme } from "@/utils/theme/ThemeContext";

const FirstRoute = () => (
  <View style={styles.scene}>
    <Text>First Tab</Text>
  </View>
);

const SecondRoute = () => (
  <View style={styles.scene}>
    <Text>Second Tab</Text>
  </View>
);

const ThirdRoute = () => (
  <View style={styles.scene}>
    <Text>Third Tab</Text>
  </View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

export default function TabViewExample() {
  const theme = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: "first", title: "Daily" },
    { key: "second", title: "Weekly" },
    { key: "third", title: "Monthly" },
  ];

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.background }}
      labelStyle={{ color: theme.colors.text }}
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

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
