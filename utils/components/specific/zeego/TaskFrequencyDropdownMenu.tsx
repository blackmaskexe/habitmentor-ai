import { TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import mmkvStorage from "@/utils/mmkvStorage";
import { useRouter } from "expo-router";
import FrequencyPickerOptionList from "../FrequencyPickerOptionList";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TaskFrequencyDropdownMenu({
  index,
  onSetHabitFrequency,
}: {
  index: number;
  onSetHabitFrequency: any;
}) {
  const setHabitFrequency = function (frequency: string[]) {
    // set the habit frequency array to have an array of days that the habit is to be done on
    onSetHabitFrequency((oldHabitFrequencies: any) => {
      const newHabitFrequencies = [...oldHabitFrequencies];
      newHabitFrequencies[index] = frequency;
      return newHabitFrequencies;
    });
  };
  const router = useRouter();
  const theme = useTheme();
  return (
    <DropdownMenu.DropdownMenuRoot>
      <DropdownMenu.DropdownMenuTrigger>
        <FrequencyPickerOptionList />
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel />
        <DropdownMenu.DropdownMenuItem
          key="everyday"
          onSelect={() => {
            setHabitFrequency([...weekdays]);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Everyday
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="weekday"
          onSelect={() => {
            setHabitFrequency([...weekdays.slice(1, 6)]);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Weekdays Only
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="weekend"
          onSelect={() => {
            setHabitFrequency([weekdays[0], weekdays[6]]);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Weekends Only
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="custom"
          onSelect={() => {
            setHabitFrequency([]);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Custom
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        {/* <DropdownMenu.Group>
          <DropdownMenu.DropdownMenuItem />
        </DropdownMenu.Group> */}

        {/* <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger />
          <DropdownMenu.SubContent />
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Arrow /> */}
      </DropdownMenu.DropdownMenuContent>
    </DropdownMenu.DropdownMenuRoot>
  );
}
