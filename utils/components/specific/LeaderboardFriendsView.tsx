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
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import { getInviteLink } from "@/utils/firebase/firestore/friendsManager";

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

  // Load leaderboard data
  useEffect(() => {
    if (!currentUser || !userProfile) {
      setMyProfile(null);
      setAllRankedUsers([]);
      setIsLoading(false);
      return;
    }

    if (allRankedUsers.length > 0) return; // Don't reload if we already have data

    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        // 1. Get my current profile from Firestore
        const myDoc = await firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();

        if (!myDoc.exists) {
          setIsLoading(false);
          return;
        }

        const myData = myDoc.data() as FirebaseUserProfile;

        // 2. Get my friends
        const friendsSnapshot = await firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("friends")
          .where("status", "==", "accepted")
          .get();

        // 3. Get friend profiles
        const allUserProfiles: (FirebaseUserProfile & { id: string })[] = [
          { ...myData, id: currentUser.uid },
        ];

        if (!friendsSnapshot.empty) {
          const friendIds = friendsSnapshot.docs.map((doc) => doc.id);
          const batchSize = 10;

          for (let i = 0; i < friendIds.length; i += batchSize) {
            const batch = friendIds.slice(i, i + batchSize);
            const batchSnapshot = await firestore()
              .collection("users")
              .where(firestore.FieldPath.documentId(), "in", batch)
              .get();

            batchSnapshot.docs.forEach((doc) => {
              const data = doc.data() as FirebaseUserProfile;
              allUserProfiles.push({ ...data, id: doc.id });
            });
          }
        }

        // 4. Sort by points and create ranked list
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

        // 5. Set the data
        const myRankedProfile = rankedUsers.find((user) => user.isMe);
        setMyProfile(myRankedProfile || null);
        setAllRankedUsers(rankedUsers);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentUser?.uid]);

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

        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>Ranking</Text>
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
  if (allRankedUsers.length <= 1) {
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
  });
}
