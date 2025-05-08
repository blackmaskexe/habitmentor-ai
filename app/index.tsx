import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";

// Components:
import LoadingScreen from "@/utils/components/general/LoadingScreen";

export default function Index() {
  // AsyncStorage.setItem("hasOnboarded", "true");
  const [isLoading, setIsLoading] = useState(true); // set a loading state to manage initial loading
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    // simple state changer if usr has onboarded
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("hasOnboarded");
        setHasOnboarded(value === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    // return a loading screen when the useEffect() hasn't finished processing stuff
    return <LoadingScreen />; // simply contains an activity indicator component for rotating wheel of loading
  }

  return <Redirect href={hasOnboarded ? "/(tabs)/home" : "/(onboarding)"} />;
}

// Implementation for Zeego Alternative:
// https://github.com/react-native-menu/menu
