// Dependencies:
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components:
import CTAButton from "@/utils/components/general/CTAButton";
import VariableItemPicker from "@/utils/components/specific/VariableItemPicker";
import { TypeAnimation } from "react-native-type-animation";
import mmkvStorage from "@/utils/mmkvStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddMoreHabitsPrompt = () => {
  const insets = useSafeAreaInsets();
  const topSafeAreaHeight = insets.top; // Height of the top unsafe area

  const theme = useTheme();
  const styles = createStyles(theme, topSafeAreaHeight);

  const router = useRouter();
  const scrollViewRef = useRef<any>(null);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    // detect user adding habits so that they can proceed (make button enabled)
    const listener = mmkvStorage.addOnValueChangedListener((changedKey) => {
      if (changedKey == "activeHabits") {
        setButtonDisabled(
          mmkvStorage.getString("activeHabits") != undefined ? false : true
        );
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Add Your Habits</Text>
        <Text style={styles.subtitle}>
          Tip: Don't add too many habits. It is better to do one habit than to
          set many and do none!
        </Text>
        <View style={styles.quoteContainer}>
          {/* <Image
            source={require("@/assets/placeholder.png")}
            style={styles.image}
          /> */}
          <TypeAnimation
            sequence={[
              {
                text: `“Small steps every day lead to big change.” — Anonymous`,
              },
              {
                text: `“You do not rise to the level of your goals. You fall to the level of your systems.” — James Clear`,
              },
              {
                text: `“Consistency is more important than intensity.” — A consistent person (probably)`,
              },
              {
                text: `“Motivation gets you going, habit keeps you growing.”  — John C. Maxwell`,
              },
              {
                text: `“Success is the sum of small efforts repeated day in and day out.” — Robert Collier`,
              },
            ]}
            typeSpeed={25}
            delayBetweenSequence={3000}
            deletionSpeed={25}
            loop
            style={{
              color: "white",
              // backgroundColor: "green",
              ...theme.text.h3,

              textAlign: "center",
              fontStyle: "italic",
            }}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.habitAddPicker}>
            <VariableItemPicker
              onModalSubmit={() => {
                // to make the scrolling of incrementing habits smoother
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <CTAButton
            title="Proceed"
            onPress={() => {
              AsyncStorage.setItem("hasOnboarded", "true")
                .then((result) => {
                  router.replace("/(tabs)/home"); // send the user to home (i just wanan drive to homeeeeeeeeeeeeeee)
                })
                .catch((err) => console.log(err));
            }}
            disabled={buttonDisabled}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

function createStyles(theme: any, topMargin: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      marginTop: Platform.OS == "android" ? topMargin : 0,
    },
    innerContainer: {
      flex: 1,
      width: "100%",
      paddingHorizontal: theme.spacing.m, // Move padding here from scrollContent
    },
    title: {
      ...theme.text.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
      textAlign: "center",
      marginTop: theme.spacing.l, // Add top margin
    },
    subtitle: {
      ...theme.text.body,
      textAlign: "center",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl, // Add bottom margin
      paddingHorizontal: theme.spacing.l, // Add horizontal padding for better text width
    },
    quoteContainer: {
      // New style for image wrapper
      // flex: 1,
      alignItems: "center",
      marginBottom: theme.spacing.l * 2,
      marginTop: theme.spacing.l,
      height: 100,
      paddingHorizontal: theme.spacing.l, // Add horizontal padding for better text width
    },
    image: {
      height: 200,
      width: 300,
      alignSelf: "center",
    },
    scrollContent: {
      flexGrow: 1,
    },
    buttonWrapper: {
      width: "100%",
      paddingBottom: theme.spacing.m,
    },
    habitAddPicker: {
      width: "100%",
    },
  });
}

export default AddMoreHabitsPrompt;
