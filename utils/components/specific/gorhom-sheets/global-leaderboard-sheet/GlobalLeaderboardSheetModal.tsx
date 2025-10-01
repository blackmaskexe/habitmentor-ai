import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import NavigationPill from "../../../general/NavigationPill";

// Define the component reference type
export type GlobalLeaderboardSheetRef = {
  present: () => void;
  dismiss: () => void;
};

export const GlobalLeaderboardSheetModal =
  forwardRef<GlobalLeaderboardSheetRef>((props, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const theme = useTheme();
    const styles = createStyles(theme);

    // Expose methods to the parent component
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
          pressBehavior="none"
        />
      ),
      []
    );

    const colorScheme = useColorScheme();
    const pillColor = colorScheme === "dark" ? "#424242" : "#DDDDDD";

    const handleEnrollInGlobal = async () => {
      const currentUser = getAuth().currentUser;

      if (!currentUser) return;
      try {
        await firestore()
          .collection("users")
          .doc(currentUser.uid)
          .update({ enrolledInGlobal: true });

        // Dismiss the modal
        bottomSheetRef.current?.dismiss();
      } catch (error) {
        console.error("Error enrolling in global leaderboard:", error);
      }
    };

    const handleCancel = () => {
      bottomSheetRef.current?.dismiss();
    };

    return (
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        snapPoints={[]}
        enableDynamicSizing={true}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 16,
        }}
        handleIndicatorStyle={{
          backgroundColor: pillColor,
        }}
        enablePanDownToClose={false}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          {/* <NavigationPill /> */}
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="globe-outline"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.title}>Join Global Leaderboard</Text>
              <Text style={styles.subtitle}>
                Compete with users worldwide and see how you rank globally!
              </Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="eye-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.infoText}>
                  Other users will see your username, avatar, and points
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={theme.colors.success}
                />
                <Text style={styles.infoText}>
                  Your personal data and habits remain completely private
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons
                  name="trophy-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.infoText}>
                  Earn recognition and compete for top ranks globally
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.enrollButton]}
                onPress={handleEnrollInGlobal}
              >
                <Text style={styles.enrollButtonText}>
                  Join Global Leaderboard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    container: {
      padding: theme.spacing.l,
      paddingBottom: theme.spacing.l,
    },
    header: {
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    title: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      textAlign: "center",
    },
    subtitle: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    infoSection: {
      marginBottom: theme.spacing.xl,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
      paddingHorizontal: theme.spacing.s,
    },
    infoText: {
      ...theme.text.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.m,
      flex: 1,
      lineHeight: 20,
    },
    buttonContainer: {
      gap: theme.spacing.m,
    },
    button: {
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      borderRadius: theme.radius.m,
      alignItems: "center",
    },
    enrollButton: {
      backgroundColor: theme.colors.primary,
    },
    enrollButtonText: {
      ...theme.text.body,
      color: theme.colors.background,
      fontWeight: "600",
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
  });
}
