import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as ContextMenu from "./context-menu";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";

export default function HabitItemContextMenu({
  habitItem,
  index,
}: {
  habitItem: any;
  index: number;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  return (
    <ContextMenu.ContextMenuRoot>
      <ContextMenu.ContextMenuTrigger>
        <View style={styles.habitCard}>
          <Ionicons name="today" style={styles.habitIcon} size={24} />
          <View style={styles.habitCardText}>
            <Text style={styles.habitName}>{habitItem.habitName}</Text>
            <Text style={styles.habitDetails}>
              Streak: 12 | 9 days until 21
            </Text>
          </View>
          <View style={styles.habitCompletionDotContainer}>
            {Array(7).map((value, index) => {
              return (
                <View
                  key={`${habitItem.habitName}-dot-${index}`}
                  style={styles.weekdayDot}
                ></View>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.habitOptions}
            onPress={() => {
              console.log("things i should of said", habitItem);
              SheetManager.show("example-sheet", {
                payload: {
                  sheetType: "habitItem",
                  habitItem: {
                    habit: habitItem,
                    habitIndex: index,
                  },
                },
              });
            }}
          >
            <Ionicons
              name="ellipsis-vertical-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ContextMenu.ContextMenuTrigger>
      <ContextMenu.ContextMenuContent>
        <ContextMenu.ContextMenuLabel />
        <ContextMenu.ContextMenuItem
          key={"ai-improves"}
          onSelect={() => {
            router.replace("/(tabs)/home");
            router.navigate({
              pathname: "/(tabs)/chat",
              params: {
                initialMessage: `Can you help me improve and be more consistent in the habit of ${habitItem.habitName}`,
              },
            });
          }}
        >
          <ContextMenu.ContextMenuItemIcon
            ios={{
              name: "cpu", // required
              pointSize: 26,
              weight: "semibold",
              scale: "medium",

              // can also be a color string. Requires iOS 15+
              hierarchicalColor: {
                dark: theme.colors.primary,
                light: theme.colors.primary,
              },

              // alternative to hierarchical color. Requires iOS 15+
              paletteColors: [
                {
                  dark: theme.colors.primary,
                  light: theme.colors.primary,
                },
              ],
            }}
          />
          <ContextMenu.ContextMenuItemTitle>
            Improve habit using AI
          </ContextMenu.ContextMenuItemTitle>
        </ContextMenu.ContextMenuItem>
      </ContextMenu.ContextMenuContent>
    </ContextMenu.ContextMenuRoot>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    allHabitsContainer: {
      //   padding: theme.spacing.m,
    },
    habitCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.s,
      borderRadius: theme.radius.m,
    },
    habitIcon: {
      marginRight: theme.spacing.m,
      color: theme.colors.primary,
    },
    habitCardText: {
      flex: 1, // Take up available space
    },
    habitName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    habitDetails: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    habitCompletionDotContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    weekdayDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginHorizontal: 2,
    },
    habitOptions: {
      alignSelf: "center",
    },
  });
}
