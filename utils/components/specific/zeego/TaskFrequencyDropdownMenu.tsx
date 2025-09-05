import { useTheme } from "@/utils/theme/ThemeContext";
import { HabitObject } from "@/utils/types";
import { useRouter } from "expo-router";
import FrequencyPickerOptionList from "../FrequencyPickerOptionList";
import * as DropdownMenu from "./dropdown-menu";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TaskFrequencyDropdownMenu({
  index,
  onSetHabitFrequency,
}: {
  index: number;
  onSetHabitFrequency: any;
}) {
  const setHabitFrequency = function (frequency: boolean[]) {
    // set the habit frequency array to have an array of days that the habit is to be done on

    // this will directly change the properties of the HabitObject's value
    onSetHabitFrequency((oldHabitFrequency: HabitObject) => {
      const newHabitFrequency = { ...oldHabitFrequency, frequency: frequency };
      return newHabitFrequency;
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
            setHabitFrequency(Array(7).fill(true));
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Everyday
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="weekday"
          onSelect={() => {
            setHabitFrequency([false, true, true, true, true, true, false]);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Weekdays Only
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="weekend"
          onSelect={() => {
            setHabitFrequency([true, false, false, false, false, false, true]);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Weekends Only
          </DropdownMenu.DropdownMenuItemTitle>
        </DropdownMenu.DropdownMenuItem>
        <DropdownMenu.DropdownMenuItem
          key="custom"
          onSelect={() => {
            setHabitFrequency(Array(7).fill(false));
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
