// Dependencies:
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Components:
import CTAButton from "@/utils/components/general/CTAButton";
import FixedItemPicker from "@/utils/components/specific/FixedItemPicker";

const ImportantHabitsPrompt = () => {
  const [buttonDisabled, setButtondisabled] = useState(true);
  const theme = useTheme();
  const styles = createStyles(theme);

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Top 3 Priority Habits</Text>
          <Text style={styles.subtitle}>
            To get you started, let's add 3 habits that you desperately want to
            get started with
          </Text>
          <Image
            source={require("@/assets/placeholder.png")}
            style={{
              height: 250,
              width: 300,
              alignSelf: "center",
            }}
          />
          <View style={styles.habitAddPicker}>
            <FixedItemPicker
              numRows={3}
              onAllHabitSelected={() => {
                setButtondisabled(false);
              }}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <CTAButton
            title="Proceed"
            onPress={() => {
              router.push("/(onboarding)/2");
            }}
            disabled={buttonDisabled}
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
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.m,
      paddingTop: theme.spacing.l,
    },
    buttonWrapper: {
      width: "100%",
      paddingHorizontal: theme.spacing.m,
      paddingBottom: theme.spacing.m,
    },
    title: {
      ...theme.text.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
      textAlign: "center",
    },
    subtitle: {
      ...theme.text.body,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
    habitAddPicker: {
      // marginTop: theme.spacing.xl * 3,
    },
  });
}

export default ImportantHabitsPrompt;
