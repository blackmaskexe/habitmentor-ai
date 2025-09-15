import React, { createContext, useContext, useRef } from "react";
import {
  HabitSheetModal,
  HabitSheetRef,
} from "../components/specific/gorhom-sheets/habit-sheet/HabitSheetModal";

type HabitSheetContextType = {
  openHabitSheet: (
    habit: any,
    habitDate: Date,
    initialDisplayScreen?: "main" | "editHabit" | "reminder"
  ) => void;

  closeHabitSheet: () => void;
};

// Create the context
const HabitSheetContext = createContext<HabitSheetContextType>({
  openHabitSheet: () => {},
  closeHabitSheet: () => {},
});

// Hook to use the context
export const useHabitSheet = () => useContext(HabitSheetContext);

// Provider component
export const HabitSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const habitSheetRef = useRef<HabitSheetRef>(null);

  const openHabitSheet = (
    habit: any,
    habitDate: Date,
    initialDisplayScreen: "main" | "editHabit" | "reminder" = "main"
  ) => {
    habitSheetRef.current?.presentWithData({
      habit,
      habitDate,
      initialDisplayScreen,
    });
  };

  const closeHabitSheet = () => {
    habitSheetRef.current?.dismiss();
  };

  return (
    <HabitSheetContext.Provider value={{ openHabitSheet, closeHabitSheet }}>
      {children}
      <HabitSheetModal ref={habitSheetRef} />
    </HabitSheetContext.Provider>
  );
};
