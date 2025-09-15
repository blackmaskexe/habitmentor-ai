import React, { createContext, useContext, useRef } from "react";
import {
  GlobalLeaderboardSheetModal,
  GlobalLeaderboardSheetRef,
} from "../components/specific/gorhom-sheets/global-leaderboard-sheet/GlobalLeaderboardSheetModal";

type GlobalLeaderboardSheetContextType = {
  openGlobalLeaderboardSheet: () => void;
  closeGlobalLeaderboardSheet: () => void;
};

// Create the context
const GlobalLeaderboardSheetContext =
  createContext<GlobalLeaderboardSheetContextType>({
    openGlobalLeaderboardSheet: () => {},
    closeGlobalLeaderboardSheet: () => {},
  });

// Hook to use the context
export const useGlobalLeaderboardSheet = () =>
  useContext(GlobalLeaderboardSheetContext);

// Provider component
export const GlobalLeaderboardSheetProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const globalLeaderboardSheetRef = useRef<GlobalLeaderboardSheetRef>(null);

  const openGlobalLeaderboardSheet = () => {
    globalLeaderboardSheetRef.current?.present();
  };

  const closeGlobalLeaderboardSheet = () => {
    globalLeaderboardSheetRef.current?.dismiss();
  };

  return (
    <GlobalLeaderboardSheetContext.Provider
      value={{ openGlobalLeaderboardSheet, closeGlobalLeaderboardSheet }}
    >
      {children}
      <GlobalLeaderboardSheetModal ref={globalLeaderboardSheetRef} />
    </GlobalLeaderboardSheetContext.Provider>
  );
};
