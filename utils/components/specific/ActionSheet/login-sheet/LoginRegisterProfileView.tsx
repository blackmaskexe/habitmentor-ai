import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import CTAButton from "@/utils/components/general/CTAButton";
import {
  createProfile,
  validateFirestoreNickname,
} from "@/utils/firebase/firestore/profileManager";
import { LEADERBOARD_AVATAR_NAMES } from "@/utils/misc/leaderboardAvatars";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";

export default function LoginRegisterProfileView() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [nickname, setNickname] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("happy-outline");
  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  return (
    <View style={styles.profileContainer}>
      {/* --- 1. Profile Preview Card --- */}
      <Text style={styles.profileTitleText}>Set Your Leaderboard Profile</Text>
      <CardWithoutImage
        title={nickname || "Your Nickname"}
        description="This is how your profile will appear"
        IconComponent={
          <Ionicons
            name={(selectedAvatar || "happy-outline") as any}
            size={30}
            color="white"
          />
        }
      />
      <View style={styles.formContainer}>
        {/* --- 2. Nickname Input --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nickname</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Choose a cool nickname"
            placeholderTextColor={theme.colors.textSecondary}
          />
          {validationWarnings.map((message, index) => {
            return (
              <Text key={index} style={styles.profanityWarningText}>
                {message}
              </Text>
            );
          })}
        </View>

        {/* --- 3. Avatar Picker --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Choose an Avatar</Text>
          <TouchableOpacity
            style={styles.addAvatarButton}
            onPress={() => {
              setTimeout(() => {
                setIsAvatarPickerVisible(!isAvatarPickerVisible);
              }, 200); // setTimeout because otherwise actionsheet do double animation glitch
              // race condition bw keyboard and picker animations

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
            <FlatList
              style={styles.avatarGridContainer}
              data={LEADERBOARD_AVATAR_NAMES}
              numColumns={5}
              keyExtractor={(item) => item}
              renderItem={({ item: avatarName }) => (
                <TouchableOpacity
                  key={avatarName}
                  style={[
                    styles.avatarTouchable,
                    selectedAvatar === avatarName && styles.avatarSelected,
                  ]}
                  onPress={() => setSelectedAvatar(avatarName)}
                >
                  <Ionicons
                    name={avatarName as any}
                    size={30}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>

      {/* --- 4. Create Button --- */}
      <View style={styles.proceedButtonContainer}>
        <CTAButton
          title="Proceed"
          onPress={async () => {
            const nicknameValidator = validateFirestoreNickname(nickname);
            if (nicknameValidator.valid) {
              await createProfile(nickname, selectedAvatar);
              SheetManager.hide("login-sheet");
            } else {
              Alert.alert(
                "Nickname not available",
                nicknameValidator.messages.join("\n")
              );
            }
          }}
          buttonHeight={45}
        />
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    profileContainer: {
      paddingBottom: theme.spacing.xl,
    },
    formContainer: {
      marginHorizontal: theme.spacing.m,
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
    profileTitleText: {
      ...theme.text.h2,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.l,
    },
    profanityWarningText: {
      color: theme.colors.error,
    },
    proceedButtonContainer: {
      marginHorizontal: theme.spacing.m,
      marginTop: theme.spacing.l,
    },
  });
}
