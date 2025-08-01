import { StyleSheet, TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SheetManager } from "react-native-actions-sheet";
import { getDate } from "@/utils/date";

export default function OverviewHabitdropdownMenu({
  habitItem,
}: {
  habitItem: any;
}) {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <DropdownMenu.DropdownMenuRoot>
      <DropdownMenu.DropdownMenuTrigger>
        <TouchableOpacity
          style={styles.habitOptions}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons
            name="ellipsis-vertical-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel>OPTIONS</DropdownMenu.DropdownMenuLabel>
        <DropdownMenu.DropdownMenuItem
          key="ask-ai"
          onSelect={() => {
            router.replace("/(tabs)/home");
            router.navigate({
              pathname: "/(tabs)/chat",
              params: {
                prefilledText: `Can you help me improve and be more consistent in the habit of ${habitItem.habitName}`,
              },
            });
          }}
        >
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "sparkles",
              pointSize: 24,
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            Improve Habit using AI
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        <DropdownMenu.DropdownMenuItem
          key="edit-habit"
          onSelect={() => {
            router.replace("/(tabs)/home");
            setTimeout(() => {
              // TODO OR NOT: Setting a 500ms delay so that it navigates to home
              // because we cannot open an action sheet on an open modal window,
              // which overview is one of them
              SheetManager.show("habit-sheet", {
                payload: {
                  habit: habitItem,
                  habitDate: getDate(),
                  initialDisplayScreen: "editHabit",
                },
              });
            }, 500);
          }}
        >
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "square.and.pencil",
              pointSize: 22,
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            Edit Habit
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        <DropdownMenu.DropdownMenuItem
          key="view-habit-options"
          onSelect={() => {
            router.replace("/(tabs)/home");
            // TODO OR NOT: same as above todo
            setTimeout(() => {
              SheetManager.show("habit-sheet", {
                payload: {
                  habit: habitItem,
                  habitDate: getDate(),
                  initialDisplayScreen: "main",
                },
              });
            }, 500);
          }}
        >
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "doc.text.magnifyingglass",
              pointSize: 18,
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            View Habit Options
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        {/* <DropdownMenu.Group>
          <DropdownMenu.DropdownMenuItem />
        </DropdownMenu.Group>
        <DropdownMenu.CheckboxItem>
          <DropdownMenu.ItemIndicator />
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger />
          <DropdownMenu.SubContent />
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Arrow /> */}
      </DropdownMenu.DropdownMenuContent>
    </DropdownMenu.DropdownMenuRoot>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    habitOptions: {
      alignSelf: "center",
    },
  });
}
