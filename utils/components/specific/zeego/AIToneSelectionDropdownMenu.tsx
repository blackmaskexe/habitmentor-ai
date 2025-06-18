import * as DropdownMenu from "./dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Theme } from "@/utils/theme/themes";

export default function AIToneSelectionDropdownMenu() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const position = "top";

  return (
    <DropdownMenu.DropdownMenuRoot>
      <DropdownMenu.DropdownMenuTrigger>
        {/* const renderOptionItem = function (
    position: "top" | "between" | "bottom" | "single",
    iconName: any,
    optionName: string,
    onPress: () => void
  ) { */}
        <TouchableOpacity
          style={[
            styles.settingItem,
            styles.topSettingItem,
            styles.bottomSettingItem,
          ]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View style={styles.settingItemContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={"mic-outline"}
                size={26}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.settingItemText}>AI Tone Selection</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        {/* const AIToneOptionItem = renderOptionItem(
    "top",
    "mic-outline",
    "AI Tone",
    () => {}
  ); */}
      </DropdownMenu.DropdownMenuTrigger>
      <DropdownMenu.DropdownMenuContent>
        <DropdownMenu.DropdownMenuLabel>
          AI Tone Options
        </DropdownMenu.DropdownMenuLabel>
        <DropdownMenu.DropdownMenuLabel />
        <DropdownMenu.DropdownMenuCheckboxItem
          key="normal"
          value={true}
          onValueChange={(next, prev) => {
            console.log("Changed from", prev, "to", next);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Normal
          </DropdownMenu.DropdownMenuItemTitle>
          <DropdownMenu.DropdownMenuItemIndicator />
        </DropdownMenu.DropdownMenuCheckboxItem>

        <DropdownMenu.DropdownMenuCheckboxItem
          key="gen-z"
          value={false}
          onValueChange={(next, prev) => {
            console.log("Changed from", prev, "to", next);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Gen Z
          </DropdownMenu.DropdownMenuItemTitle>
          <DropdownMenu.DropdownMenuItemIndicator />
        </DropdownMenu.DropdownMenuCheckboxItem>

        <DropdownMenu.DropdownMenuCheckboxItem
          key="motivational"
          value={false}
          onValueChange={(next, prev) => {
            console.log("Changed from", prev, "to", next);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Motivational
          </DropdownMenu.DropdownMenuItemTitle>
          <DropdownMenu.DropdownMenuItemIndicator />
        </DropdownMenu.DropdownMenuCheckboxItem>

        <DropdownMenu.DropdownMenuCheckboxItem
          key="ultra-motivational"
          value={false}
          onValueChange={(next, prev) => {
            console.log("Changed from", prev, "to", next);
          }}
        >
          <DropdownMenu.DropdownMenuItemTitle>
            Ultra Motivational
          </DropdownMenu.DropdownMenuItemTitle>
          <DropdownMenu.DropdownMenuItemIndicator />
        </DropdownMenu.DropdownMenuCheckboxItem>

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

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingTop: 30,
      paddingBottom: 8,
    },
    sectionHeaderText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary, // Replaced "#8E8E93"
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    settingsGroup: {
      backgroundColor: theme.colors.surface, // Replaced "white"
      borderRadius: 10,
      marginHorizontal: 16,
      shadowColor: theme.colors.shadow || theme.colors.text, // Replaced "#000"
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 1,
      elevation: 1,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface, // Replaced "#ffffff"
    },
    // Add new styles for top and bottom items
    topSettingItem: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    bottomSettingItem: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    settingItemContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingItemText: {
      fontSize: 17,
      color: theme.colors.text, // Replaced "#000"
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.border, // Replaced "#C7C7CC"
      marginLeft: 56, // Align with text start
      opacity: 0.5,
    },
    signOutButton: {
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.primary, // Replaced "#007AFF"
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginHorizontal: 16,
    },
    signOutText: {
      color: theme.colors.primary || theme.colors.textSecondary, // Replaced "white", assuming onPrimary or a white color exists
      fontSize: 16,
      fontWeight: "600",
    },
    versionText: {
      textAlign: "center",
      fontSize: 12,
      color: theme.colors.textSecondary, // Replaced "#8E8E93"
      marginTop: 20,
      marginBottom: 24,
    },
  });
}
