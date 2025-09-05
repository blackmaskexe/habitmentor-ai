// TODO FOR THE FUTURE:
// IMPLEMENT THEMING
import React, { useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface OnboardingItem {
  title: string;
  description: string;
  image: any;
}

interface LoginPageOnboardingProps {
  onboardingData: OnboardingItem[];
}

export default function LoginPageOnboarding({
  onboardingData,
}: LoginPageOnboardingProps) {
  // the onboardingData is an array in the following form:
  // [
  //   {
  //     title: "Gains Chat with AI",
  //     description: "Your own AI Workout Logger and Tracking Assistant",
  //     image: require("@/assets/images/icon-transparent.png"),
  //   },
  // ];

  const [currentPage, setCurrentPage] = useState(0);
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  // Adjust card width to show a peek of the next card
  const cardWidth = width - 32; // Smaller to show next card
  const cardOffset = width * 0.85; // Distance between card centers (85% of screen width)
  const itemWidth = cardOffset; // Each item takes slightly less than full width

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentPage(currentIndex);
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={true} // Enable default paging
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
        style={[styles.container]}
      >
        {onboardingData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.cardContainer,
              {
                width: width, // Full width
                opacity: currentPage === index ? 1 : 0.7,
                transform: [{ scale: currentPage === index ? 1 : 0.95 }],
              },
            ]}
          >
            <View style={[styles.card, { width: width - 32 }]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPage === index ? styles.activeDot : {}]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 360,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center", // Center the card horizontally
  },
  card: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    marginVertical: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    paddingHorizontal: 12,
  },
  image: {
    width: "100%",
    height: 280,
    marginBottom: 24,
    marginTop: 12,
    borderRadius: 35,
    transform: [
      {
        scale: 1.2,
      },
    ],
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
    width: 24,
  },
});
