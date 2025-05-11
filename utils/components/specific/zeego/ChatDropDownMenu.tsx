import { TouchableOpacity } from "react-native";
import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import mmkvStorage from "@/utils/mmkvStorage";
import { useRouter } from "expo-router";

export default function ChatDropDownMenu() {
  const router = useRouter();
  const theme = useTheme();
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
            name="ellipsis-vertical-circle-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel />
        <DropdownMenu.DropdownMenuItem
          key="clear-chat"
          onSelect={() => {
            mmkvStorage.set("chatMessages", JSON.stringify([]));

            router.setParams({ _refreshTimestamp: Date.now().toString() });
            console.log("Chat messages were cleared");
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Clear Chat
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
