import { ThemeProvider } from "@/utils/theme/ThemeContext";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import HabitSheet from "./habit-sheet/HabitActionSheet";
import SuggestionsSheet from "./suggestions-sheet/SuggestionsActionSheet";
import LeaderboardSheet from "./leaderboard-sheet/LeaderBoardActionSheet";

registerSheet("habit-sheet", (props) => {
  return (
    <ThemeProvider>
      <HabitSheet {...props} />
    </ThemeProvider>
  );
});

registerSheet("suggestions-sheet", (props) => {
  return (
    <ThemeProvider>
      <SuggestionsSheet {...props} />
    </ThemeProvider>
  );
});

registerSheet("leaderboard-sheet", (props) => {
  return (
    <ThemeProvider>
      <LeaderboardSheet {...props} />
    </ThemeProvider>
  );
});

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "habit-sheet": SheetDefinition;
    "suggestions-sheet": SheetDefinition;
    "leaderboard-sheet": SheetDefinition;
    payload: {
      value: string;
    };
  }
}

export {};
