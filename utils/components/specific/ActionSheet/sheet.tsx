import { ThemeProvider } from "@/utils/theme/ThemeContext";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ExampleSheet from "./BaseActionSheet";

registerSheet("habit-sheet", (props) => {
  return (
    <ThemeProvider>
      <ExampleSheet {...props} />
    </ThemeProvider>
  );
});

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "habit-sheet": SheetDefinition;
    payload: {
      value: string;
    };
  }
}

export {};
