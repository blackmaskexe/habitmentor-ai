import { TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import mmkvStorage from "@/utils/mmkvStorage";
import { useRouter } from "expo-router";
import FrequencyPickerOptionList from "../FrequencyPickerOptionList";

export default function TaskFrequencyDropdownMenu({
  index,
  onSetHabitFrequency,
}: {
  index: number;
  onSetHabitFrequency: any;
}) {
  const setHabitFrequency = function (frequency: string) {
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
            setHabitFrequency("everyday");
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Everyday
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="weekday"
          onSelect={() => {
            setHabitFrequency("weekday");
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            All Weekdays
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="weekend"
          onSelect={() => {
            setHabitFrequency("weekend");
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            All Weekend
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem key="custom">
          <DropdownMenu.DropdownMenuItemTitle>
            Custom (Coming Soon)
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        {/* <DropdownMenu.Group>
          <DropdownMenu.DropdownMenuItem />
        </DropdownMenu.Group> */}
        <DropdownMenu.DropdownMenuCheckboxItem
          key="checkmoneybenny"
          value="on"
          onSelect={(event) => {
            event.preventDefault();
          }}
          onValueChange={(next, previous) => {
            console.log("check money benny");
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Check money benny
          </DropdownMenu.DropdownMenuItemTitle>
          <DropdownMenu.DropdownMenuItemIndicator>
            Bom bom bom tigrelini watermelini
          </DropdownMenu.DropdownMenuItemIndicator>
        </DropdownMenu.DropdownMenuCheckboxItem>
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
