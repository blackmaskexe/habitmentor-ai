import { useTheme } from "@/utils/theme/ThemeContext";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

type CardProps = {
  imageSource: any;
  title: string;
  description: string;
  backgroundColor?: string;
  mode?: "light" | "dark";
  textColor?: string;
  borderRadius?: number;
  padding?: number;
  callback?: any;
};

const Card: React.FC<CardProps> = ({
  imageSource,
  title,
  description,
  backgroundColor,
  mode = "dark", // 'light' or 'dark'
  textColor = "#ffffff",
  borderRadius = 16,
  padding = 16,
  callback,
}) => {
  const theme = useTheme();

  const defaultBackground =
    backgroundColor || (mode === "dark" ? "#1A1A1A" : "#f0f0f0");
  const defaultTextColor = mode === "dark" ? "#ffffff" : "#000000";

  return (
    <TouchableOpacity
      onPress={() => {
        if (callback) {
          callback();
        }
      }}
      activeOpacity={callback ? 0.8 : 1}
      style={[
        styles.card,
        { backgroundColor: defaultBackground, borderRadius, padding },
      ]}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <Text style={[styles.title, { color: textColor || defaultTextColor }]}>
        {title}
      </Text>
      <Text
        style={[styles.description, { color: textColor || defaultTextColor }]}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    margin: 10,
    // width: "90%", // Takes up 90% of parent width
    width: "100%",
    alignSelf: "center",
  },
  image: {
    // note that the image should be significantly wider than it's length
    // for it's stupid ahh to render the image correctly
    width: screenWidth * 0.75,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default Card;

// Some Example Usages of this Card Component:
{
  /* <CustomCard
imageSource={{ uri: "https://via.placeholder.com/300" }}
title="Welcome to React Native"
description="This is a sample card showcasing a minimal design."
mode="light"
textColor="#FF9500"
/>

<CustomCard
imageSource={{ uri: "https://via.placeholder.com/300" }}
title="Dark Mode Design"
description="Experience the sleek and modern UI with our new dark theme."
backgroundColor="#252525"
textColor="#FFA500"
/>

<CustomCard
imageSource={{ uri: "https://via.placeholder.com/300" }}
title="Customizable Card"
description="Play with props like colors, padding, and text styles."
backgroundColor="#292929"
textColor="#F0F0F0"
borderRadius={20}
padding={20}
/>

<CustomCard
imageSource={{ uri: "https://via.placeholder.com/300" }}
title="Elegant Design"
description="Inspired by minimalist design with a touch of elegance."
backgroundColor="#1A1A1A"
textColor="#FF6347"
// note that dark mode coupled with the above ff6347 theme looks the best
/> */
}
