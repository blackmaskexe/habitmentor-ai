import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import * as Haptics from "expo-haptics";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import ActivityIndicatorOverlay from "../../general/ActivityIndicatorOverlay";

const db = getFirestore();
const functionsInstance = getFunctions();

export default function ProfileDropdownMenu({
  profileId,
}: {
  profileId: string;
}) {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const currentUser = getAuth().currentUser;

  const [isProcessingRequest, setIsProcessingRequest] =
    useState<boolean>(false);

  if (isProcessingRequest) {
    return <ActivityIndicatorOverlay visible={true} />;
  }

  return (
    <DropdownMenu.DropdownMenuRoot>
      <DropdownMenu.DropdownMenuTrigger asChild>
        <TouchableOpacity
          style={styles.triggerContainer}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View>
            <Ionicons
              name="ellipsis-horizontal-circle-outline"
              size={28}
              color={theme.colors.primary}
            />
          </View>
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>

      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel>
          Profile Options
        </DropdownMenu.DropdownMenuLabel>

        <DropdownMenu.DropdownMenuItem
          key="Report User"
          onSelect={async () => {
            try {
              // early return if trying to report self
              if (currentUser && profileId == currentUser.uid) {
                Alert.alert("You cannot report yourself!");
                return;
              }
              setIsProcessingRequest(true);
              const reportUser = httpsCallable(functionsInstance, "reportUser");
              await reportUser({ reportedId: profileId });
              setIsProcessingRequest(false);
              Alert.alert(
                "Success",
                "The user was reported. Our team will investigate this user."
              );
            } catch (err) {
              setIsProcessingRequest(false);
              Alert.alert(
                "Failed",
                "Something wrong happened, please try to report again later"
              );
              console.log("CRITICAL ERROR, COULD NOT REPORT USER", err);
            }
          }}
        >
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "person.crop.circle.badge.exclamationmark",
              pointSize: 24,
              hierarchicalColor: {
                dark: theme.colors.primary,
                light: theme.colors.primary,
              },
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            Report User
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        <DropdownMenu.DropdownMenuItem
          key="block-user"
          onSelect={async () => {}}
        >
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "nosign",
              pointSize: 24,
              hierarchicalColor: {
                dark: theme.colors.primary,
                light: theme.colors.primary,
              },
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            Block User
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
      </DropdownMenu.DropdownMenuContent>
    </DropdownMenu.DropdownMenuRoot>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    triggerContainer: {
      marginRight: theme.spacing.m,
      alignSelf: "center",
      justifyContent: "center",
    },
    badgeContainer: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: theme.colors.error,
      borderRadius: 9,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.colors.background,
    },
    badgeText: {
      color: "white",
      fontSize: 10,
      fontWeight: "bold",
    },
  });
}
