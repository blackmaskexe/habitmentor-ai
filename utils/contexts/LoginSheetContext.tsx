import React, { createContext, useContext, useRef } from "react";
import {
  LoginSheetModal,
  LoginSheetRef,
} from "../components/specific/gorhom-sheets/login-sheet/LoginSheetModal";

type LoginSheetContextType = {
  openLoginSheet: () => void;
  closeLoginSheet: () => void;
};

// Create the context
const LoginSheetContext = createContext<LoginSheetContextType>({
  openLoginSheet: () => {},
  closeLoginSheet: () => {},
});

// Hook to use the context
export const useLoginSheet = () => useContext(LoginSheetContext);

// Provider component
export const LoginSheetProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const loginSheetRef = useRef<LoginSheetRef>(null);

  const openLoginSheet = () => {
    loginSheetRef.current?.present();
  };

  const closeLoginSheet = () => {
    loginSheetRef.current?.dismiss();
  };

  return (
    <LoginSheetContext.Provider value={{ openLoginSheet, closeLoginSheet }}>
      {children}
      <LoginSheetModal ref={loginSheetRef} />
    </LoginSheetContext.Provider>
  );
};
