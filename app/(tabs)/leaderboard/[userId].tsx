import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/utils/firebase/firestore/profileManager";
import { FirebaseUserProfile } from "@/utils/firebase/types";
import { getDateFromFormattedDate, getOrdinalDate } from "@/utils/date";

export default function UserProfilePage() {
  const { userId } = useLocalSearchParams();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId && typeof userId === "string") {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
        setIsLoading(false);
      } else {
        setIsLoading(false); // No userId, stop loading
      }
    };

    fetchProfile();
  }, [userId]);

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
        <Text style={styles.nicknameText}>User Not Found</Text>
        <Text style={styles.statLabel}>
          The profile you're looking for doesn't exist.
        </Text>
      </View>
    );
  }

  // 3. Profile Loaded State
  const pointsStats = [
    { label: "Total Points", value: userProfile.points.toString() },
    {
      label: "Points This Month",
      value: userProfile.pointsThisMonth.toString(),
    },
  ];

  const friendsCount = userProfile.friends.length;
  const joinedDate = getOrdinalDate(
    getDateFromFormattedDate(userProfile.profileCreationDate)
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.subHeaderText}>
            <Ionicons
              name="people-outline"
              size={14}
              color={theme.colors.textSecondary}
            />{" "}
            {friendsCount} Friends
          </Text>
          <Text style={styles.subHeaderText}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={theme.colors.textSecondary}
            />{" "}
            Joined {joinedDate}
          </Text>
        </View>
      </View>

      {/* --- Action Button --- */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons
          name="person-add-outline"
          size={20}
          color={theme.colors.background}
        />
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>

      {/* --- Stats Grid --- */}
      <View style={styles.statsContainer}>
        {pointsStats.map((stat, index) => (
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
