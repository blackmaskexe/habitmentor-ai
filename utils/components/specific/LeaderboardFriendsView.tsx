import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Share,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import { getInviteLink } from "@/utils/firebase/functions/friendsManager";
import CTAButton from "../general/CTAButton";

type RankedUser = {
  id: string;
  nickname: string;
  avatarIcon: string;
  points: number;
  rank: number;
  isMe: boolean;
};

type LeaderboardFriendsViewProps = {
  userProfile: FirebaseUserProfile | null;
};

const db = getFirestore();

export default function LeaderboardFriendsView({
  userProfile,
}: LeaderboardFriendsViewProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const currentUser = getAuth().currentUser;

  const [myProfile, setMyProfile] = useState<RankedUser | null>(null);
  const [allRankedUsers, setAllRankedUsers] = useState<RankedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load friends data with real-time updates
  const [friendsData, setFriendsData] = useState<
    (FirebaseUserProfile & { id: string })[]
  >([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);

  // First, get the list of friend IDs and listen for changes
  useEffect(() => {
    let unsubscribeFriendsList = () => {};

    if (!currentUser || !userProfile) return;

    // const friendsListRef = firestore()
    //   .collection("users")
    //   .doc(currentUser.uid)
    //   .collection("friends")
    //   .where("status", "==", "accepted");
    const friendsQuery = query(
      collection(db, "users", currentUser.uid, "friends"),
      where("status", "==", "accepted")
    );

    unsubscribeFriendsList = onSnapshot(friendsQuery, (querySnapshot) => {
      if (querySnapshot) {
        const ids = querySnapshot.docs.map(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => doc.id
        );
        setFriendIds(ids);
        // Mark friends list as loaded (even if empty)
        setFriendsLoaded(true);
      }
    });

    return () => unsubscribeFriendsList();
  }, [currentUser?.uid, userProfile]);

  // Then, listen to friend profile data changes
  useEffect(() => {
    if (friendIds.length === 0) {
      setFriendsData([]);
      return;
    }

    let isMounted = true;
    const friendProfiles = new Map<
      string,
      FirebaseUserProfile & { id: string }
    >();
    let updatesReceived = 0;

    const unsubscribers = friendIds.map((friendId) => {
      const friendDocRef = doc(db, "users", friendId);
      return onSnapshot(friendDocRef, (docSnapshot) => {
        updatesReceived++;
        if (docSnapshot && docSnapshot.exists()) {
          const data = docSnapshot.data() as FirebaseUserProfile;
          friendProfiles.set(friendId, { ...data, id: friendId });
        } else {
          friendProfiles.delete(friendId);
        }
        // Only update state after all listeners have fired at least once
        if (updatesReceived >= friendIds.length && isMounted) {
          setFriendsData(Array.from(friendProfiles.values()));
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [friendIds]);

  // Snapshot for my profile only
  useEffect(() => {
    let unsubscribe = () => {};

    if (!currentUser || !userProfile) {
      setMyProfile(null);
      setIsLoading(() => {
        // doing this so that users are first set to none, then loading is finished
        setAllRankedUsers([]);
        return false;
      });
      return;
    }

    if (!friendsLoaded) setIsLoading(true); // only load if don't have data the first time
    const myDocRef = doc(db, "users", currentUser.uid);

    unsubscribe = onSnapshot(myDocRef, (docSnapshot) => {
      try {
        if (!docSnapshot || !docSnapshot.exists()) {
          setIsLoading(false);
          return;
        }

        const myProfileData = docSnapshot.data() as FirebaseUserProfile;

        // Only build leaderboard if friends have been loaded
        if (!friendsLoaded) {
          return; // Wait for friends to load first
        }

        // Build leaderboard with my fresh data + friends data
        const allUserProfiles: (FirebaseUserProfile & { id: string })[] = [
          { ...myProfileData, id: currentUser.uid },
          ...friendsData,
        ];

        // Sort by points and create ranked list

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

        // Set the data
        const myRankedProfile = rankedUsers.find((user) => user.isMe);
        setMyProfile(myRankedProfile || null);
        setIsLoading(() => {
          setAllRankedUsers(rankedUsers);
          return false;
        });
      } catch (error) {
        console.error("Error updating leaderboard:", error);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uid, friendsData, friendsLoaded]); // Include friendsLoaded as dependency

  const handleUserPress = (userId: string) => {
    router.push(`/(tabs)/leaderboard/${userId}`);
  };

  const renderUserItem = ({ item }: { item: RankedUser }) => (
    <TouchableOpacity
      style={styles.userCard} // Always use normal styles for the ranking list
      onPress={() => handleUserPress(item.id)}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Ionicons
          name={item.avatarIcon as any}
          size={28}
          color={theme.colors.primary} // Always use normal colors for the ranking list
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
          color={theme.colors.textSecondary} // Always use normal colors for the ranking list
        />
      </View>
    </TouchableOpacity>
  );

  const renderMyRankHeader = () => {
    if (!myProfile) return null;

    return (
      <View>
        <View style={styles.myRankSection}>
          <Text style={styles.sectionTitle}>Your Position</Text>
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
          <Text style={styles.sectionTitle}>Ranking</Text>
          <Text style={styles.pointsThisMonthLabel}>Overall Points</Text>
        </View>
      </View>
    );
  };

  const renderAddFriendsFooter = () => (
    <TouchableOpacity
      style={styles.addFriendsCard}
      onPress={async () => {
        await Share.share({
          message: `Add me as a friend on HabitMentor-AI. Let's track our progress together! ${getInviteLink()}`,
        });
      }}
    >
      <View style={styles.addFriendsIconContainer}>
        <Ionicons name="add-outline" size={24} color={theme.colors.primary} />
      </View>

      <View style={styles.addFriendsInfo}>
        <Text style={styles.addFriendsText}>Add More Friends</Text>
        <Text style={styles.addFriendsSubtext}>Invite friends to compete</Text>
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

  // Not logged in
  if (!userProfile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.placeholderText}>
          Please log in to see your friends.
        </Text>
      </View>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  // No friends (only me)
  if (allRankedUsers.length <= 1 && !isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons
          name="people-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyTitle}>No Friends Yet!</Text>
        <Text style={styles.emptyDescription}>
          Add friends to see how you rank against each other.
        </Text>
        <CTAButton
          title="Add Friends"
          iconName="add"
          onPress={async () => {
            await Share.share({
              message: `Add me as a friend on HabitMentor-AI. Let's track our progress together! ${getInviteLink()}`,
            });
          }}
          isBackgroundVisible={false}
        />
      </View>
    );
  }

  // Show leaderboard
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
        ListFooterComponent={renderAddFriendsFooter}
        ListFooterComponentStyle={styles.listFooter}
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
      marginBottom: theme.spacing.m,
    },
    listFooter: {
      marginTop: theme.spacing.m,
    },
    addFriendsCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.m,
      padding: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
    },
    addFriendsIconContainer: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderStyle: "solid",
    },
    addFriendsInfo: {
      flex: 1,
    },
    addFriendsText: {
      ...theme.text.body,
      color: theme.colors.primary,
      marginBottom: 2,
      fontSize: 16,
      fontWeight: "600",
    },
    addFriendsSubtext: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      fontSize: 13,
    },
    pointsThisMonthLabel: {
      ...theme.text.small,
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginLeft: 4,
    },
  });
}
