import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";

import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import { LEADERBOARD_AVATAR_NAMES } from "@/utils/misc/leaderboardAvatars";
import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import { Filter } from "bad-words";
import { useRouter } from "expo-router";

type UpdatedProfileType = {
  nickname: string;
  avatarIcon: string;
};

export default function EditLeaderboardProfile() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const filter = new Filter();
  const currentUser = getAuth().currentUser;

  const [isLoading, setIsLoading] = useState(true);
  const [originalProfile, setOriginalProfile] = useState<FirebaseUserProfile | null>(null);
  const [updatedProfile, setUpdatedProfile] = useState<UpdatedProfileType>({
    nickname: "",
    avatarIcon: "happy-outline",
  });
  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);

  // Load current profile from Firestore
  useEffect(() => {
    const loadCurrentProfile = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists()) {
          const profileData = userDoc.data() as FirebaseUserProfile;
          setOriginalProfile(profileData);
          setUpdatedProfile({
            nickname: profileData.nickname,
            avatarIcon: profileData.avatarIcon,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentProfile();
  }, [currentUser]);

  const handleSaveProfile = () => {
    if (!originalProfile) return;

    // Check if there are any changes
    const hasChanges = 
      originalProfile.nickname !== updatedProfile.nickname ||
      originalProfile.avatarIcon !== updatedProfile.avatarIcon;

    if (hasChanges) {
      Alert.alert(
        "Update Profile",
        "Are you sure you want to save these changes?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Save",
            onPress: () => {
              // TODO: Implement save profile logic here
              // This callback will be implemented by the user
              saveProfileCallback(updatedProfile);
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  // Empty callback function to be implemented by user
  const saveProfileCallback = (profile: UpdatedProfileType) => {
    // User will implement this function
    console.log("Profile to save:", profile);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!currentUser || !originalProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load profile</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleSaveProfile}
          style={styles.backButtonIcon}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.saveHintText}>
          Press back button to save changes
        </Text>

        {/* Profile Preview Card */}
        <View style={styles.profilePreviewContainer}>
          <CardWithoutImage
            title={
              filter.isProfane(updatedProfile.nickname)
                ? "That's rude!!"
                : updatedProfile.nickname || "Your Nickname"
            }
            description="This is how your profile will appear"
            IconComponent={
              <Ionicons
                name={updatedProfile.avatarIcon as any}
                size={30}
                color="white"
              />
            }
          />
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Nickname Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nickname</Text>
            <TextInput
              style={styles.input}
              value={updatedProfile.nickname}
              onChangeText={(text) =>
                setUpdatedProfile((prev) => ({ ...prev, nickname: text }))
              }
              placeholder="Choose a cool nickname"
              placeholderTextColor={theme.colors.textSecondary}
            />
            {filter.isProfane(updatedProfile.nickname) && (
              <Text style={styles.profanityWarningText}>
                Please keep it pg-friendly
              </Text>
            )}
          </View>

          {/* Avatar Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Choose an Avatar</Text>
            <TouchableOpacity
              style={styles.addAvatarButton}
              onPress={() => {
                setTimeout(() => {
                  setIsAvatarPickerVisible(!isAvatarPickerVisible);
                }, 200);
                Keyboard.dismiss();
              }}
            >
              <Ionicons
                name={
                  isAvatarPickerVisible
                    ? "remove-circle-outline"
                    : "add-circle-outline"
                }
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.addAvatarButtonText}>
                {isAvatarPickerVisible ? "Hide Avatars" : "Show Avatars"}
              </Text>
            </TouchableOpacity>

            {isAvatarPickerVisible && (
              <View style={styles.avatarGridContainer}>
                {LEADERBOARD_AVATAR_NAMES.map((avatarName) => (
                  <TouchableOpacity
                    key={avatarName}
                    style={[
                      styles.avatarTouchable,
                      updatedProfile.avatarIcon === avatarName && styles.avatarSelected,
                    ]}
                    onPress={() =>
                      setUpdatedProfile((prev) => ({ ...prev, avatarIcon: avatarName }))
                    }
                  >
                    <Ionicons
                      name={avatarName as any}
                      size={30}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: Platform.OS === "android" ? 15 : 5,
      marginHorizontal: theme.spacing.s,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.m,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
    },
    errorText: {
      ...theme.text.h2,
      color: theme.colors.error,
      textAlign: "center",
      marginBottom: theme.spacing.l,
    },
    backButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      borderRadius: theme.radius.m,
    },
    backButtonText: {
      ...theme.text.body,
      color: theme.colors.background,
      fontWeight: "600",
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    backButtonIcon: {
      padding: 5,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
      flex: 1,
    },
    headerRightPlaceholder: {
      width: 28 + 10,
    },
    saveHintText: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      textAlign: "center",
      marginBottom: theme.spacing.s,
      opacity: 0.7,
    },
    profilePreviewContainer: {
      marginBottom: theme.spacing.m,
    },
    formContainer: {
      marginHorizontal: theme.spacing.s,
      paddingBottom: theme.spacing.xl,
    },
    inputGroup: {
      marginTop: theme.spacing.l,
    },
    label: {
      ...theme.text.body,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: theme.spacing.s,
    },
    input: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
      ...theme.text.body,
      color: theme.colors.text,
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
    },
    profanityWarningText: {
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      fontSize: 12,
    },
    addAvatarButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.radius.m,
    },
    addAvatarButtonText: {
      ...theme.text.body,
      color: theme.colors.primary,
      marginLeft: theme.spacing.s,
    },
    avatarGridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: theme.spacing.m,
    },
    avatarTouchable: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      borderWidth: 2,
      borderColor: "transparent",
    },
    avatarSelected: {
      borderColor: theme.colors.primary,
    },
  });
