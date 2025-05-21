import { TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import mmkvStorage from "@/utils/mmkvStorage";
import { useRouter } from "expo-router";
import { useNotifications } from "@/utils/useNotifications";

export default function HomeAddDropdownMenu() {
  const router = useRouter();
  const theme = useTheme();

  const { cancelAllScheduledNotifications } = useNotifications();
  return (
    <DropdownMenu.DropdownMenuRoot>
      <DropdownMenu.DropdownMenuTrigger>
        <TouchableOpacity
          style={{
            marginRight: theme.spacing.m,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel>
          Home Options
        </DropdownMenu.DropdownMenuLabel>
        <DropdownMenu.DropdownMenuItem
          key="add-habit"
          onSelect={() => {
            console.log("tung tung tung");
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Add Habit
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>

        <DropdownMenu.DropdownMenuItem
          key="clear-reminder"
          onSelect={() => {
            cancelAllScheduledNotifications();
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Clear All Reminders get this outta here and into settings
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
