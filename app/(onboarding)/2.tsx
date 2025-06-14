import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import React from "react";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Components:
import ToggleSwitch from "@/utils/components/general/ToggleSwitch";
import CTAButton from "@/utils/components/general/CTAButton";
import GenericList from "@/utils/components/general/GenericList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserSettingsPrompt = () => {
  const router = useRouter();
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const styles = createStyles(theme, width);

  const [disabled, setDisabled] = useState(true);
  const buttonOpacity = useRef(new Animated.Value(0.5)).current;
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cloudSaveEnabled, setCloudSaveEnabled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Configure Your Experience</Text>
        <Text style={styles.subtitle}>
          Customize how you want to use the app
        </Text>

        <View style={styles.contentContainer}>
          <View style={styles.settingsGroup}>
            <Pressable
              style={[styles.settingItem, styles.topSettingItem]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <View style={styles.settingItemContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.settingItemText}>
                  Reminder Notifications
                </Text>
              </View>
              <ToggleSwitch
                isEnabled={notificationsEnabled}
                onToggle={setNotificationsEnabled}
                size="medium"
              />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={[styles.settingItem, styles.bottomSettingItem]}
              onPress={() => setCloudSaveEnabled(!cloudSaveEnabled)}
            >
              <View style={styles.settingItemContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="cloud-outline"
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.settingItemText}>Sync to Cloud</Text>
              </View>
              <ToggleSwitch
                isEnabled={cloudSaveEnabled}
                onToggle={(enabled) => {
                  setCloudSaveEnabled(enabled);
                  Alert.alert("Feature coming soon");
                }}
                size="medium"
              />
            </Pressable>
          </View>

          <GenericList
            items={[
              {
                listText:
                  "‎ ‎ Get notified when it's time to complete your habits",
                bullet: {
                  type: "text",
                  bulletText: "🔔",
                },
              },
              {
                listText:
                  "‎ ‎ Save your progress to the cloud and sync across devices",
                bullet: {
                  type: "text",
                  bulletText: "☁️",
                },
              },
              {
                listText:
                  "‎ ‎ You can change these settings anytime from the settings menu",
                bullet: {
                  type: "text",
                  bulletText: "⚙️",
                },
              },
            ]}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <CTAButton
            title="Begin Your Journey"
            onPress={() => {
              AsyncStorage.setItem("hasOnboarded", "true")
                .then((result) => {
                  router.replace("/(tabs)/home"); // send the user to home (i just wanan drive to homeeeeeeeeeeeeeee)
                })
                .catch((err) => console.log(err));
            }}
            disabled={disabled}
          />
        </Animated.View>
      </View>
    </View>
  );
};

function createStyles(theme: any, width: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.m,
    },
    heading: {
      ...theme.text.h1,
      color: theme.colors.text,
      textAlign: "center",
      marginTop: theme.spacing.xl * 2,
      marginBottom: theme.spacing.l,
    },
    subtitle: {
      ...theme.text.h3,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.l,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start",
      width: "100%",
      paddingVertical: theme.spacing.l,
      gap: theme.spacing.xl * 2,
    },
    settingsGroup: {
      backgroundColor: theme.colors.altBackground,
      borderRadius: 10,
      width: "100%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 1,
      elevation: 1,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.altBackground,
    },
    topSettingItem: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    bottomSettingItem: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    settingItemContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingItemText: {
      fontSize: 17,
      color: theme.colors.text,
    },
    divider: {
      height: 0.5,
      backgroundColor: "#C7C7CC",
      marginLeft: 56,
      opacity: 0.5,
    },
    buttonContainer: {
      width: width,
      paddingHorizontal: theme.spacing.m,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.l * 2,
    },
  });
}

export default UserSettingsPrompt;
