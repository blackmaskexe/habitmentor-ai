import { ThemeProvider } from "@/utils/theme/ThemeContext";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import HabitSHeet from "./habit-sheet/HabitActionSheet";
import SuggestionsSheet from "./suggestions-sheet/SuggestionsActionSheet";

registerSheet("habit-sheet", (props) => {
  return (
    <ThemeProvider>
      <HabitSHeet {...props} />
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

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "habit-sheet": SheetDefinition;
    "suggestions-sheet": SheetDefinition;
    payload: {
      value: string;
    };
  }
}

export {};
