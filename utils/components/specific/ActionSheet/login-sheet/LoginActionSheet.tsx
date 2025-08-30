import { useTheme } from "@/utils/theme/ThemeContext";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
} from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";

// Component imports:
import NavigationPill from "../../../general/NavigationPill";
import AppleSignInButton from "@/utils/components/general/AppleSignInButton";
import CrossButton from "@/utils/components/general/CrossButton";
import { SheetManager } from "react-native-actions-sheet";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  getAuth,
  FirebaseAuthTypes,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import CardWithoutImage from "@/utils/components/general/CardWithoutImage";
import { Ionicons } from "@expo/vector-icons";
import { LEADERBOARD_AVATAR_NAMES } from "@/utils/misc/leaderboardAvatars";

export type LoginSheetPayloadData = {};

export default function LoginActionSheet(props: SheetProps<"login-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const [display, setDisplay] = useState<"login" | "register-profile">("login");
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [nickname, setNickname] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isAvatarPickerVisible, setIsAvatarPickerVisible] = useState(false);

  function renderLoginView() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Sign in to Join the Leaderboard</Text>
        <Text style={styles.descriptionText}>
          By default, only your friends can see your nickname and avatar. You
          can choose to show them on the global ranking later.
        </Text>

        <AppleSignInButton />
      </View>
    );
  }

  function renderRegisterProfileView() {
    return (
      <View style={styles.profileContainer}>
        {/* --- 1. Profile Preview Card --- */}
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
          </View>
          {/* --- 3. Avatar Picker --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Choose an Avatar</Text>
            <TouchableOpacity
              style={styles.addAvatarButton}
              onPress={() => setIsAvatarPickerVisible(!isAvatarPickerVisible)}
            >
              <Ionicons
                name="add-circle-outline"
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
        {/* <Button
          title="Create Profile"
          onPress={() => {
            console.log("Creating profile:", { nickname, selectedAvatar });
            // Here you would call your createProfile function
          }}
        /> */}
      </View>
    );
  }
  const payloadData: LoginSheetPayloadData = props.payload;

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
      // LOGIC FOR CHECKING IF THERE ALREADY EXISTS A USER PROFILE IN THE FIRESTORE,
      // IF THERE IS, DON'T SHOW THE REGISTER PROFILE SCREEN
      // IF THERE ISN'T, DO SHOW THE REGISTER PROFILE SCREEN

      // setting it to register-profile without any checks for now for dev purposes
      setDisplay("register-profile");
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        backgroundColor: theme.colors.background,
      }}
      closable={false}
    >
      <View style={styles.headerContainer}>
        <NavigationPill />
        <View style={styles.crossButtonContainer}>
          <CrossButton
            outline={false}
            onPress={() => {
              router.back();
              SheetManager.hide("login-sheet");
            }}
          />
        </View>
      </View>

      {display == "login" ? renderLoginView() : null}
      {display == "register-profile" ? renderRegisterProfileView() : null}
    </ActionSheet>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    headerContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.s,
      marginBottom: theme.spacing.m,
    },
    crossButtonContainer: {
      position: "absolute",
      top: theme.spacing.xs,
      right: theme.spacing.m,
    },
    // Login View Styles
    contentContainer: {
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.m,
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    titleText: {
      ...theme.text.h2,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    descriptionText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    // Register Profile View Styles
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
  });
}
