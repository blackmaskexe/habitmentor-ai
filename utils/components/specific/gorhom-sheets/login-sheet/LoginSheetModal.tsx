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
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import NavigationPill from "../../../general/NavigationPill";
import LoginButtonView from "./LoginButtonView";
import LoginRegisterProfileView from "./LoginRegisterProfileView";

export type LoginSheetPayloadData = {};

export type LoginSheetRef = {
  present: () => void;
  dismiss: () => void;
};

export const LoginSheetModal = forwardRef<LoginSheetRef>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const [display, setDisplay] = useState<"login" | "register-profile">("login");
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetRef.current?.present();
    },
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...backdropProps}
        pressBehavior="close"
        onPress={() => {
          router.replace("/(tabs)/home");
        }}
      />
    ),
    []
  );

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), async (user) => {
      setUser(user);
      if (user) {
        const hasProfile = await doesUserHaveFirebaseProfile();
        if (hasProfile) {
          bottomSheetRef.current?.dismiss();
        } else {
          setDisplay("register-profile");
        }
      } else {
        setDisplay("login");
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const colorScheme = useColorScheme();
  const pillColor = colorScheme === "dark" ? "#424242" : "#DDDDDD"; // the official iOS colors for the navigation pill to be consistent

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      ref={bottomSheetRef}
      snapPoints={[]}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: 16,
      }}
      handleIndicatorStyle={{
        backgroundColor: pillColor,
      }}
      keyboardBehavior="interactive"
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.headerContainer}>
          {/* <NavigationPill /> */}
          <View style={styles.crossButtonContainer}></View>
        </View>

        {display == "login" ? <LoginButtonView /> : null}
        {display == "register-profile" ? (
          <LoginRegisterProfileView
            dismissSheet={() => bottomSheetRef.current?.dismiss()}
          />
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

function createStyles(theme: Theme) {
  return StyleSheet.create({
    bottomSheetContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 8,
    },
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
