import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  getUserProfile,
  isFriend,
} from "@/utils/firebase/firestore/profileManager";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import { getDateFromFormattedDate, getOrdinalDate } from "@/utils/date";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import {
  getFriendCount,
  handleAcceptFriendRequest,
  handleSendFriendRequest,
} from "@/utils/firebase/functions/friendsManager";
import ActivityIndicatorOverlay from "@/utils/components/general/ActivityIndicatorOverlay";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";

const db = getFirestore();
const functionsInstance = getFunctions();

export default function UserProfilePage() {
  const { userId: profileOwnerId } = useLocalSearchParams();
  const viewerUserId = getAuth().currentUser?.uid;

  const theme = useTheme();
  const styles = createStyles(theme);

  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [relationStatus, setRelationStatus] = useState<string | null>(null); // relation between the viewer and the pesron whose profile it is
  const [isProcessingRequest, setIsProcessingRequest] =
    useState<boolean>(false);

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchProfile = async () => {
      if (profileOwnerId && typeof profileOwnerId === "string") {
        const profile = await getUserProfile(profileOwnerId); // profile of the person of whom the profile page is

        if (viewerUserId && viewerUserId != profileOwnerId) {
          // const userFriendsDocRef = firestore()
          //   .collection("users")
          //   .doc(viewerUserId)
          //   .collection("friends")
          //   .doc(profileOwnerId);
          const userFriendsDocRef = doc(
            db,
            "users",
            viewerUserId,
            "friends",
            profileOwnerId
          );

          unsubscribe = onSnapshot(userFriendsDocRef, (docSnapshot) => {
            if (docSnapshot && docSnapshot.exists()) {
              const data = docSnapshot.data();
              if (data) {
                setRelationStatus(data.status);
              }
            } else {
              setRelationStatus(null);
            }
          });

          setUserProfile(profile);
          setIsLoading(false);

          return;
        } // reference to the person whose profile we are viewing in self's firestore document
        else if (viewerUserId && viewerUserId == profileOwnerId) {
          setRelationStatus("self");
          setUserProfile(profile);
          setIsLoading(false);

          return;
        }
      } else {
        setIsLoading(false); // No profileOwnerId, stop loading
        return;
      }
    };

    fetchProfile();
    // cleaup function to stop listening to firestore friend updates
    return () => unsubscribe();
  }, [profileOwnerId, viewerUserId]);

  // 1. Loading State
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // 2. Profile Not Found State
  if (!userProfile || userProfile.nickname === "Profile not found") {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons
          name="sad-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text
          style={styles.nicknameText}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          User Not Found
        </Text>
        <Text style={styles.statLabel}>
          The profile you're looking for doesn't exist.
        </Text>
      </View>
    );
  }

  // 3. Profile Loaded State
  const pointsStats = [
    { label: "Total Points", value: userProfile.points.toString() },
  ];

  const additionalStats = [
    { label: "Combined Streak", value: userProfile.streak?.toString() || "0" },
    {
      label: "Lifetime Habits Done",
      value: userProfile.totalHabitsCompleted?.toString() || "0",
    },
  ];

  const friendsCount = getFriendCount(); // will get the number of friends
  // but the thing is, this only works for the user himself because it gets an mmkvstorage fetch
  //
  const joinedDate = getOrdinalDate(
    getDateFromFormattedDate(userProfile.profileCreationDate)
  );

  function renderRequestButton() {
    type ButtonData = {
      visible: boolean;
      style: any;
      buttonTitle: string;
      onPress: (() => void) | null; // if is null, then button should be disabled
    };
    let buttonData: ButtonData;

    switch (relationStatus) {
      case "self":
        buttonData = {
          visible: false,
          style: {},
          buttonTitle: "",
          onPress: () => {},
        };
        break;
      case "pending_sent":
        buttonData = {
          visible: true,
          style: styles.requestSentButton,
          buttonTitle: "Request Sent",
          onPress: null,
        };
        break;
      case "pending_received":
        buttonData = {
          visible: true,
          style: styles.addButton,
          buttonTitle: "Accept Request",
          onPress: async () => {
            setIsProcessingRequest(true);
            await handleAcceptFriendRequest(profileOwnerId as string);
            setIsProcessingRequest(false);
          },
        };
        break;
      case "accepted":
        buttonData = {
          visible: true,
          style: styles.requestSentButton,
          buttonTitle: "Already a Friend",
          onPress: null,
        };
        break;
      case "blocked":
        buttonData = {
          visible: true,
          style: styles.requestSentButton,
          buttonTitle: "User Blocked. Press to Unblock",
          onPress: async () => {
            // unblockUser
            try {
              const unblockUser = httpsCallable(
                functionsInstance,
                "unblockUser"
              );
              setIsProcessingRequest(true);
              await unblockUser({ gettingUnblockedUserId: profileOwnerId });
              setIsProcessingRequest(false);
              Alert.alert("Success", "You have unblocked the user");
            } catch (err) {
              console.log("Error, could not unblock the user", err);
              setIsProcessingRequest(false);
            }
          },
        };
        break;
      default:
        buttonData = {
          visible: true,
          style: styles.addButton,
          buttonTitle: "Send Friend Request",
          onPress: async () => {
            setIsProcessingRequest(true);
            await handleSendFriendRequest(profileOwnerId as string);
            setIsProcessingRequest(false);
          },
        };
        break;
    }
    return buttonData.visible ? (
      <TouchableOpacity
        style={buttonData.style}
        disabled={buttonData.onPress == null ? true : false}
        onPress={
          buttonData && buttonData.onPress ? buttonData.onPress : () => {}
        }
      >
        <Ionicons
          name="person-add-outline"
          size={20}
          color={theme.colors.background}
        />
        <Text style={styles.addButtonText}>{buttonData.buttonTitle}</Text>
      </TouchableOpacity>
    ) : null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicatorOverlay visible={isProcessingRequest} />
      {/* --- Profile Header --- */}
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name={userProfile.avatarIcon as any}
            size={60}
            color={theme.colors.primary}
          />
        </View>
        <Text style={styles.nicknameText}>{userProfile.nickname}</Text>
        <View style={styles.subHeaderContainer}>
          {profileOwnerId && viewerUserId && profileOwnerId == viewerUserId && (
            <Text style={styles.subHeaderText}>
              <Ionicons
                name="people-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              {friendsCount} Friends
            </Text>
          )}
          <Text style={styles.subHeaderText}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={theme.colors.textSecondary}
            />
            Joined {joinedDate}
          </Text>
        </View>
      </View>

      {renderRequestButton()}

      {/* --- Stats Grid --- */}
      <View style={styles.statsContainer}>
        {/* Total Points - Full Width */}
        {pointsStats.map((stat, index) => (
          <View key={index} style={styles.statBoxFullWidth}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}

        {/* Additional Stats - Two columns */}
        {additionalStats.map((stat, index) => (
          <View key={index} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
    },
    // Header
    headerContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    nicknameText: {
      ...theme.text.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    subHeaderContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.spacing.l,
      marginTop: theme.spacing.s,
    },
    subHeaderText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
      alignItems: "center",
    },

    // Add Button
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.m,
      borderRadius: theme.radius.m,
      marginBottom: theme.spacing.xl,
    },
    requestSentButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.textTertiary,
      paddingVertical: theme.spacing.m,
      borderRadius: theme.radius.m,
      marginBottom: theme.spacing.xl,
    },
    addButtonText: {
      color: theme.colors.background,
      marginLeft: theme.spacing.s,
      fontSize: 16,
      fontWeight: "600",
    },
    // Stats
    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    statBox: {
      backgroundColor: theme.colors.surface,
      width: "48%", // Two columns with a small gap
      padding: theme.spacing.l,
      borderRadius: theme.radius.m,
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    statBoxFullWidth: {
      backgroundColor: theme.colors.surface,
      width: "100%", // Full width for total points
      padding: theme.spacing.l,
      borderRadius: theme.radius.m,
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    statValue: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
}
