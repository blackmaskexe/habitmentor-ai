// Dependencies:
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
// Components:
import CardWithoutImage from "@/utils/components/general/CardWithoutImage";

const { height, width } = Dimensions.get("window");

const AppIntroduction = () => {
  const router = useRouter();

  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* {Array.from({ length: 6 }).map((value, index) => {
          return (
            <View style={styles.}>
              <CardWithoutImage title={"Testing"} key={index} />
            </View>
          );
        })} */}

        <CardWithoutImage
          title="Better Life"
          description="bro do you even want to improve your life? Click this message if you do"
          onPress={() => {
            console.log("don't you stop");
            router.push("/(onboarding)/1");
          }}
        />
      </ScrollView>
    </View>
  );
};

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "90%",
      alignSelf: "center",
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingVertical: 20,
    },
  });
}

export default AppIntroduction;
