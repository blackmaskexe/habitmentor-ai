import { StyleSheet, TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";

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
        <TouchableOpacity style={styles.habitOptions}>
          <Ionicons
            name="ellipsis-vertical-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel />
        <DropdownMenu.DropdownMenuItem
          key="clear-chat"
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
          <DropdownMenu.DropdownMenuItemTitle>
            Improve Habit using AI
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
