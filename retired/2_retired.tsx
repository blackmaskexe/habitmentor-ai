import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import React from "react";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components:
import GenericList from "@/utils/components/general/GenericList";
import CTAButton from "@/utils/components/general/CTAButton";

const AppMissionIntroduction = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const [disabled, setDisabled] = useState(true);
  const buttonOpacity = useRef(new Animated.Value(0.5)).current;

  const { height, width } = Dimensions.get("window");

  const theme = useTheme();
  const styles = createStyles(theme, width);
  AsyncStorage.getItem("coreHabits")
    .then((result) => {
      console.log(
        result,
        "ye hai core habits can you believe dat brah jalidi wa se hato"
      );
    })
    .catch((err) => {
      console.log(err, "JALDI WAHA SE HATOO");
    });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/placeholder.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.contentContainer}>
          <GenericList
            items={[
              {
                listText:
                  "It is said that good habits are built over 21 days of consistency",
                bullet: {
                  type: "text",
                  bulletText: "✨",
                },
              },
              {
                listText:
                  "Your challenge will be to hold be consistent with a habit for atleast 21 days",
                bullet: {
                  type: "text",
                  bulletText: "✨",
                },
              },
              {
                listText:
                  "Once you successfully have completed a habit for more than 21 days, you will get an opportunity to add even more habits",
                bullet: {
                  type: "text",
                  bulletText: "✨",
                },
              },
            ]}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <CTAButton
            title="I accept the challenge"
            onPress={() => {
              console.log("pressed");
              router.push("/(onboarding)/3");
            }}
            disabled={disabled}
          />
        </Animated.View>
      </View>
    </View>
  );
};

function createStyles(theme: any, width: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // Remove justifyContent and alignItems as they interfere with ScrollView
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: "center", // Center children horizontally
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.m,
    },
    heading: {
      ...theme.text.h1,
      color: theme.colors.text,
      textAlign: "center",
      marginTop: 90,
      marginBottom: theme.spacing.l,
    },
    imageContainer: {
      marginVertical: theme.spacing.l,
      alignItems: "center",
      marginTop: theme.spacing.xl * 3,
    },
    logo: {
      height: 200,
      width: 200,
      borderRadius: 5,
      transform: [{ scale: 1.5 }],
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      width: "100%",
      paddingVertical: theme.spacing.l,
    },
    buttonContainer: {
      width: width,
      paddingHorizontal: theme.spacing.m,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.l * 2,
    },
    subtitle: {
      ...theme.text.h3,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.l,
    },
    description: {
      ...theme.text.h3,
      color: theme.colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: theme.spacing.l,
      lineHeight: 24, // Add some breathing room between lines
    },
  });
}

export default AppMissionIntroduction;
