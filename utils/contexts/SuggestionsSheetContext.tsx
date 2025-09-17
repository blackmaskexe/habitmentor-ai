import React, { createContext, useContext, useRef } from "react";
import {
  SuggestionsSheetModal,
  SuggestionsSheetRef,
  SuggestionsSheetPayloadData,
} from "../components/specific/gorhom-sheets/suggestions-sheet/SuggestionsSheetModal";

type SuggestionsSheetContextType = {
  openSuggestionsSheet: (payload: SuggestionsSheetPayloadData) => void;
  closeSuggestionsSheet: () => void;
};

// Create the context
const SuggestionsSheetContext = createContext<SuggestionsSheetContextType>({
  openSuggestionsSheet: () => {},
  closeSuggestionsSheet: () => {},
});

// Hook to use the context
export const useSuggestionsSheet = () => useContext(SuggestionsSheetContext);

// Provider component
export const SuggestionsSheetProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const suggestionsSheetRef = useRef<SuggestionsSheetRef>(null);

  const openSuggestionsSheet = (payload: SuggestionsSheetPayloadData) => {
    suggestionsSheetRef.current?.presentWithData(payload);
  };

  const closeSuggestionsSheet = () => {
    suggestionsSheetRef.current?.dismiss();
  };

  return (
    <SuggestionsSheetContext.Provider
      value={{
        openSuggestionsSheet,
        closeSuggestionsSheet,
      }}
    >
      {children}
      <SuggestionsSheetModal ref={suggestionsSheetRef} />
    </SuggestionsSheetContext.Provider>
  );
};
