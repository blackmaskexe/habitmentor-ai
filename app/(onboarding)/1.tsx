// Dependencies:
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useRef } from "react";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";

// Components:
import CTAButton from "@/utils/components/general/CTAButton";
import VariableItemPicker from "@/utils/components/specific/VariableItemPicker";

const AddMoreHabitsPrompt = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const router = useRouter();
  const scrollViewRef = useRef<any>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Add Your Habits</Text>
        <Text style={styles.subtitle}>
          It is recommended that you add the habits that you desperately want to
          improve. Tip is to not overwhelm yourself with lots of habits!
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/placeholder.png")}
            style={styles.image}
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
              router.push("/(onboarding)/3");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    imageContainer: {
      // New style for image wrapper
      alignItems: "center",
      marginBottom: theme.spacing.l,
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
