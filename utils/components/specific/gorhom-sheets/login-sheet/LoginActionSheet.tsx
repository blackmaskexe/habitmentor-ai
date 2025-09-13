import CrossButton from "@/utils/components/general/CrossButton";
import { doesUserHaveFirebaseProfile } from "@/utils/firebase/firestore/profileManager";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import NavigationPill from "../../../general/NavigationPill";
import LoginButtonView from "./LoginButtonView";
import LoginRegisterProfileView from "./LoginRegisterProfileView";

export type LoginSheetPayloadData = {};

export default function LoginActionSheet(props: SheetProps<"login-sheet">) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const payloadData: LoginSheetPayloadData = props.payload;

  const [display, setDisplay] = useState<"login" | "register-profile">("login");
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), async (user) => {
      setUser(user);
      if (user) {
        const hasProfile = await doesUserHaveFirebaseProfile();
        if (hasProfile) {
          SheetManager.hide("login-sheet");
        } else {
          setDisplay("register-profile");
        }
      } else {
        setDisplay("login");
      }
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

      {display == "login" ? <LoginButtonView /> : null}
      {display == "register-profile" ? <LoginRegisterProfileView /> : null}
    </ActionSheet>
  );
}

function createStyles(theme: Theme) {
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
  });
}
