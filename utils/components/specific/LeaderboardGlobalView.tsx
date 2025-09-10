import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import { SheetManager } from "react-native-actions-sheet";

type RankedUser = {
  id: string;
  nickname: string;
  avatarIcon: string;
  points: number;
  rank: number;
  isMe: boolean;
};

type LeaderboardGlobalViewProps = {
  userProfile: FirebaseUserProfile | null;
};

const db = getFirestore();

export default function LeaderboardGlobalView({
  userProfile,
}: LeaderboardGlobalViewProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const currentUser = getAuth().currentUser;

  const [myProfile, setMyProfile] = useState<RankedUser | null>(null);
  const [allRankedUsers, setAllRankedUsers] = useState<RankedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentChecked, setEnrollmentChecked] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

  // Check enrollment status and show sheet if needed
  useEffect(() => {
    if (!currentUser || !userProfile || enrollmentChecked) return;

    const checkEnrollmentStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (!userDoc.exists()) return;

        const userData = userDoc.data() as FirebaseUserProfile;

        // If enrolledInGlobal doesn't exist, create it as false
        if (userData && userData.enrolledInGlobal === undefined) {
          // await firestore()
          //   .collection("users")
          //   .doc(currentUser.uid)
          //   .update({ enrolledInGlobal: false });
          updateDoc(doc(db, "users", currentUser.uid), {
            enrolledInGlobal: false,
          });

          setIsEnrolled(false);
        } else if (userData && userData.enrolledInGlobal === false) {
          setIsEnrolled(false);
        } else {
          setIsEnrolled(true);
          // User is enrolled, load global leaderboard
          loadGlobalLeaderboard();
        }

        setEnrollmentChecked(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking enrollment status:", error);
        setEnrollmentChecked(true);
        setIsLoading(false);
      }
    };

    checkEnrollmentStatus();
  }, [currentUser?.uid, userProfile, enrollmentChecked]);

  // Listen for enrollment changes
  useEffect(() => {
    if (!currentUser || !enrollmentChecked) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc && doc.exists()) {
        const userData = doc.data() as FirebaseUserProfile;
        if (userData && userData.enrolledInGlobal === true && !isEnrolled) {
          setIsEnrolled(true);
          loadGlobalLeaderboard();
        } else if (
          userData &&
          userData.enrolledInGlobal === false &&
          isEnrolled
        ) {
          setIsEnrolled(false);
          setAllRankedUsers([]);
          setMyProfile(null);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser, enrollmentChecked, isEnrolled]);

  // Load global leaderboard data
  const loadGlobalLeaderboard = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      // Get all users enrolled in global leaderboard
      const enrolledInGlobalUsersQuery = query(
        collection(db, "users"),
        where("enrolledInGlobal", "==", true)
      );
      const globalUsersSnapshot = await getDocs(enrolledInGlobalUsersQuery);

      if (globalUsersSnapshot && globalUsersSnapshot.empty) {
        setAllRankedUsers([]);
        setMyProfile(null);
        setIsLoading(false);
        return;
      }

      // Convert to user profiles
      const allUserProfiles: (FirebaseUserProfile & { id: string })[] = [];
      if (globalUsersSnapshot) {
        globalUsersSnapshot.docs.forEach(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data() as FirebaseUserProfile;
            allUserProfiles.push({ ...data, id: doc.id });
          }
        );
      }

      // Sort by points and create ranked list
      allUserProfiles.sort((a, b) => b.points - a.points);
      const rankedUsers: RankedUser[] = allUserProfiles.map((user, index) => ({
        id: user.id,
        nickname: user.nickname,
        avatarIcon: user.avatarIcon,
        points: user.points,
        rank: index + 1,
        isMe: user.id === currentUser.uid,
      }));

      // Set the data
      const myRankedProfile = rankedUsers.find((user) => user.isMe);
      setMyProfile(myRankedProfile || null);
      setAllRankedUsers(rankedUsers);
    } catch (error) {
      console.error("Error loading global leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for real-time global leaderboard updates
  useEffect(() => {
    if (!currentUser || !isEnrolled) return;

    setIsLoading(true);
    const enrolledInGlobalUsersQuery = query(
      collection(db, "users"),
      where("enrolledInGlobal", "==", true)
    );
    const unsubscribe = onSnapshot(
      enrolledInGlobalUsersQuery,
      (globalUsersSnapshot) => {
        if (globalUsersSnapshot && globalUsersSnapshot.empty) {
          setAllRankedUsers([]);
          setMyProfile(null);
          setIsLoading(false);
          return;
        }

        const allUserProfiles: (FirebaseUserProfile & { id: string })[] = [];
        if (globalUsersSnapshot) {
          globalUsersSnapshot.docs.forEach(
            (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
              const data = doc.data() as FirebaseUserProfile;
              allUserProfiles.push({ ...data, id: doc.id });
            }
          );
        }

        allUserProfiles.sort((a, b) => b.points - a.points);
        const rankedUsers: RankedUser[] = allUserProfiles.map(
          (user, index) => ({
            id: user.id,
            nickname: user.nickname,
            avatarIcon: user.avatarIcon,
            points: user.points,
            rank: index + 1,
            isMe: user.id === currentUser.uid,
          })
        );

        const myRankedProfile = rankedUsers.find((user) => user.isMe);
        setMyProfile(myRankedProfile || null);
        setAllRankedUsers(rankedUsers);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isEnrolled]);

  const handleUserPress = (userId: string) => {
    router.push(`/(tabs)/leaderboard/${userId}`);
  };

  const renderUserItem = ({ item }: { item: RankedUser }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item.id)}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Ionicons
          name={item.avatarIcon as any}
          size={28}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
          {item.nickname}
          {item.isMe ? " (You)" : ""}
        </Text>
        <Text style={styles.userPoints}>{item.points} points</Text>
      </View>

      <View style={styles.chevronContainer}>
        <Ionicons
          name="chevron-forward-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  const renderMyRankHeader = () => {
    if (!myProfile) return null;

    return (
      <View>
        <View style={styles.myRankSection}>
          <Text style={styles.sectionTitle}>Your Global Position</Text>
          <TouchableOpacity
            style={[styles.userCard, styles.myUserCard]}
            onPress={() => handleUserPress(myProfile.id)}
          >
            <View style={styles.rankContainer}>
              <Text style={[styles.rankText, styles.myRankText]}>
                #{myProfile.rank}
              </Text>
            </View>

            <View style={styles.avatarContainer}>
              <Ionicons
                name={myProfile.avatarIcon as any}
                size={32}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.userInfo}>
              <Text style={[styles.userName, styles.myUserName]}>
                {myProfile.nickname} (You)
              </Text>
              <Text style={[styles.userPoints, styles.myUserPoints]}>
                {myProfile.points} points
              </Text>
            </View>

            <View style={styles.chevronContainer}>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color={theme.colors.background}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.rankingSection,
            { flexDirection: "row", alignItems: "center", gap: 6 },
          ]}
        >
          <Text style={styles.sectionTitle}>Global Ranking</Text>
          <Text style={styles.pointsThisMonthLabel}>Overall Points</Text>
        </View>
      </View>
    );
  };

  // Not logged in
  if (!userProfile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.placeholderText}>
          Please log in to see the global leaderboard.
        </Text>
      </View>
    );
  }

  // Loading
  if (isLoading || !enrollmentChecked) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading global leaderboard...</Text>
      </View>
    );
  }

  // Not enrolled in global leaderboard
  if (!isEnrolled) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons
          name="globe-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.enrollmentTitle}>
          You must enable global leaderboards to participate
        </Text>
        <Text style={styles.enrollmentDescription}>
          Join the global leaderboard to compete with users worldwide and see
          how you rank!
        </Text>
        <TouchableOpacity
          style={styles.enrollmentButton}
          onPress={() => SheetManager.show("global-leaderboard-sheet")}
        >
          <Text style={styles.enrollmentButtonText}>
            Enable Global Leaderboard
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No global users
  if (allRankedUsers.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons
          name="globe-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyTitle}>No Global Users Yet!</Text>
        <Text style={styles.emptyDescription}>
          Be the first to join the global leaderboard.
        </Text>
      </View>
    );
  }

  // Show global leaderboard
  return (
    <View style={styles.container}>
      <FlatList
        data={allRankedUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderMyRankHeader}
        ListHeaderComponentStyle={styles.listHeader}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centeredContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
    },
    listContainer: {
      padding: theme.spacing.m,
    },
    listHeader: {
      marginBottom: theme.spacing.m,
    },
    myRankSection: {
      marginBottom: theme.spacing.l,
    },
    rankingSection: {},
    sectionTitle: {
      ...theme.text.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      marginLeft: theme.spacing.xs,
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.m,
      padding: theme.spacing.s,
      marginBottom: theme.spacing.xs,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    myUserCard: {
      backgroundColor: theme.colors.primary,
      marginBottom: theme.spacing.s,
    },
    rankContainer: {
      width: 40,
      alignItems: "center",
    },
    rankText: {
      ...theme.text.body,
      color: theme.colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    myRankText: {
      color: theme.colors.background,
    },
    avatarContainer: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: theme.spacing.s,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...theme.text.body,
      color: theme.colors.text,
      marginBottom: 2,
      fontSize: 16,
      fontWeight: "600",
    },
    myUserName: {
      color: theme.colors.background,
    },
    userPoints: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      fontSize: 13,
    },
    myUserPoints: {
      color: theme.colors.background,
      opacity: 0.8,
    },
    chevronContainer: {
      marginLeft: theme.spacing.s,
    },
    placeholderText: {
      color: theme.colors.text,
      ...theme.text.h2,
    },
    loadingText: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.m,
    },
    emptyTitle: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    emptyDescription: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    enrollmentTitle: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
      textAlign: "center",
    },
    enrollmentDescription: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: theme.spacing.xl,
    },
    enrollmentButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
      borderRadius: theme.radius.m,
      alignItems: "center",
    },
    enrollmentButtonText: {
      ...theme.text.body,
      color: theme.colors.background,
      fontWeight: "600",
      fontSize: 16,
    },
    pointsThisMonthLabel: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginLeft: 4,
    },
  });
}
