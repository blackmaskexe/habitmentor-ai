import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as DropdownMenu from "./dropdown-menu";

export default function LeaderboardDropdownMenu({}: {}) {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [isAlert, setIsAlert] = useState(false);

  return (
    <DropdownMenu.DropdownMenuRoot>
      <DropdownMenu.DropdownMenuTrigger asChild>
        <TouchableOpacity style={styles.triggerContainer}>
          <View>
            <Ionicons
              name="ellipsis-horizontal-circle-outline"
              size={28}
              color={theme.colors.primary}
            />
            {isAlert && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel>
          Leaderboard Options
        </DropdownMenu.DropdownMenuLabel>
        <DropdownMenu.DropdownMenuItem key="invite-friend" onSelect={() => {}}>
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "person.3",
              pointSize: 24,
              hierarchicalColor: {
                dark: theme.colors.primary,
                light: theme.colors.primary,
              },
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            Invite Friends
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        <DropdownMenu.DropdownMenuItem
          key="friend-requests"
          onSelect={() => {}}
        >
          {isAlert ? (
            <DropdownMenu.DropdownMenuItemIcon
              ios={{
                name: "1.circle",
                pointSize: 24,
                hierarchicalColor: {
                  dark: theme.colors.error,
                  light: theme.colors.error,
                },
              }}
            />
          ) : (
            <DropdownMenu.DropdownMenuItemIcon
              ios={{
                name: "eyes",
                pointSize: 24,
                hierarchicalColor: {
                  dark: theme.colors.primary,
                  light: theme.colors.primary,
                },
              }}
            />
          )}
          <DropdownMenu.DropdownMenuItemTitle>
            See Friend Requests
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
