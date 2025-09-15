import React, { createContext, useContext, useState } from "react";
import ActivityIndicatorOverlay from "../components/general/ActivityIndicatorOverlay";

type ActivityIndicatorContextType = {
  showIndicator: () => void;
  hideIndicator: () => void;
  isVisible: boolean;
};

// Create the context
const ActivityIndicatorContext = createContext<ActivityIndicatorContextType>({
  showIndicator: () => {},
  hideIndicator: () => {},
  isVisible: false,
});

// Hook to use the context
export const useActivityIndicator = () => useContext(ActivityIndicatorContext);

// Provider component
export const ActivityIndicatorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showIndicator = () => {
    setIsVisible(true);
  };

  const hideIndicator = () => {
    setIsVisible(false);
  };

  return (
    <ActivityIndicatorContext.Provider
      value={{ showIndicator, hideIndicator, isVisible }}
    >
      {children}
      <ActivityIndicatorOverlay visible={isVisible} />
    </ActivityIndicatorContext.Provider>
  );
};
