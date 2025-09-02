import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";

type FriendRequest = {
  id: string; // The user ID who sent the request
  nickname: string;
  avatarIcon: string;
  createdAt: any;
};

export default function FriendRequestsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const currentUser = getAuth().currentUser;

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    // Set up real-time listener for friend requests
    const unsubscribe = firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("friends")
      .where("status", "==", "pending_received")
      .onSnapshot(
        (snapshot) => {
          const requests: FriendRequest[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            requests.push({
              id: doc.id, // This is the sender's user ID
              nickname: data.nickname,
              avatarIcon: data.avatarIcon,
              createdAt: data.createdAt,
            });
          });

          // Sort by creation date (newest first)
          requests.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.toDate() - a.createdAt.toDate();
            }
            return 0;
          });

          setFriendRequests(requests);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching friend requests:", error);
          setIsLoading(false);
        }
      );

    return () => unsubscribe();
  }, [currentUser]);

  const handleRequestPress = (senderId: string) => {
    // Navigate to the sender's profile page where they can accept the request
    router.push(`/(tabs)/leaderboard/${senderId}`);
  };

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleRequestPress(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Ionicons
          name={item.avatarIcon as any}
          size={40}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.requestInfo}>
        <Text style={styles.nickname}>{item.nickname}</Text>
        <Text style={styles.requestLabel}>wants to be friends</Text>
      </View>
      <View style={styles.actionContainer}>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading friend requests...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons
          name="person-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyTitle}>Not Signed In</Text>
        <Text style={styles.emptyDescription}>
          Please sign in to view friend requests.
        </Text>
      </View>
    );
  }

  if (friendRequests.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons
          name="people-outline"
          size={60}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyTitle}>No Friend Requests</Text>
        <Text style={styles.emptyDescription}>
          You don't have any pending friend requests at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Requests</Text>
        <Text style={styles.headerSubtitle}>
          {friendRequests.length} pending request
          {friendRequests.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={friendRequests}
        renderItem={renderFriendRequest}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
    },
    header: {
      padding: theme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      ...theme.text.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
    },
    listContainer: {
      padding: theme.spacing.m,
    },
    requestCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.m,
    },
    requestInfo: {
      flex: 1,
    },
    nickname: {
      ...theme.text.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    requestLabel: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    actionContainer: {
      marginLeft: theme.spacing.s,
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
  });
}
