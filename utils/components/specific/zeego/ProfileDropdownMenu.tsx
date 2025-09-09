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
  doc,
  getDoc,
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
            // All I'm basically doing is putting an entry in the 'reports'
            // collection of firestore, and the document id is the id of the
            // user that is reported, so I can look into it myself later
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
          onSelect={async () => {
            // What I'm basically doing is adding changing the status of the user being blocked
            // in the friends array of the user to 'blocked', and what I do is in the "send friend request"
            // section, check first if the user to which someone is trying to send a friend request doesn't
            // have the person sending the request in their friends list under the status 'blocked'
            try {
              // early return if trying to report self
              if (currentUser && profileId == currentUser.uid) {
                Alert.alert("You cannot block yourself!");
                return;
              }

              // first, we'll check the status of the user already in the firestore:
              if (currentUser) {
                const userDocSnapshot = await getDoc(
                  doc(db, "users", currentUser.uid, "friends", profileId)
                );
                if (userDocSnapshot && userDocSnapshot.exists()) {
                  const friendProfileSnapshot = userDocSnapshot.data();
                  if (
                    friendProfileSnapshot &&
                    friendProfileSnapshot.status &&
                    friendProfileSnapshot.status == "blocked"
                  ) {
                    Alert.alert("You have already blocked the user.");
                    return;
                  }
                }
              }

              setIsProcessingRequest(true);
              const blockUser = httpsCallable(functionsInstance, "blockUser");
              await blockUser({ gettingBlockedUserId: profileId });
              console.log("mai yyhaan tak kaise pahunchha bhagwan jaane");
              setIsProcessingRequest(false);
              Alert.alert(
                "Success",
                "The user was blocked. They can no longer send friend requests to you."
              );
            } catch (err) {
              setIsProcessingRequest(false);
              Alert.alert(
                "Failed",
                "Something wrong happened, please try to block again later"
              );
              console.log("CRITICAL ERROR, COULD NOT BLOCK USER", err);
            }
          }}
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
