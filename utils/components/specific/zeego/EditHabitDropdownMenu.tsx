import { deleteHabit, getHabitObjectFromId } from "@/utils/habits";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { useHabitSheet } from "@/utils/contexts/HabitSheetContext";

export default function EdithabitDropdownMenu({
  habitId,
  dismissSheet,
}: {
  habitId: string;
  dismissSheet: () => void;
}) {
  const router = useRouter();
  const theme = useTheme();
  const { closeHabitSheet } = useHabitSheet();

  const habit = getHabitObjectFromId(habitId)!;
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
          <Ionicons
            name="ellipsis-vertical-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel>
          Edit Habit Options
        </DropdownMenu.DropdownMenuLabel>
        <DropdownMenu.DropdownMenuLabel />
        <DropdownMenu.DropdownMenuItem
          key="delete-habit"
          onSelect={() => {
            Alert.alert(
              `Delete Habit?`,
              `Are you sure you want to delete ${habit.habitName}?`,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    dismissSheet();
                    setTimeout(() => {
                      deleteHabit(habitId);
                    }, 100);
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Delete Habit
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
