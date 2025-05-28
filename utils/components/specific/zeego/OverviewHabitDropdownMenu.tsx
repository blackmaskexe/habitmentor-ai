import { StyleSheet, TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

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
                initialMessage: `Can you help me improve and be more consistent in the habit of ${habitItem.habitName}`,
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
          key="consistency-graph"
          onSelect={() => {}}
        >
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "chart.bar",
              pointSize: 18,
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            View Consistency Graph
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        <DropdownMenu.DropdownMenuItem key="skip-today" onSelect={() => {}}>
          <DropdownMenu.DropdownMenuItemIcon
            ios={{
              name: "forward.end",
              pointSize: 24,
            }}
          />
          <DropdownMenu.DropdownMenuItemTitle>
            Skip Habit for Today
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
