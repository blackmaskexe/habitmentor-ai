import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  textColor = "#ffffff",
  borderRadius = 16,
  padding = 12,
  callback,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const hasImage = !!imageSource;

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
        {
          backgroundColor: theme.colors.altBackground,
          borderRadius,
          padding,
          overflow: "hidden",
        },
        !hasImage && { justifyContent: "center" },
      ]}
    >
      {hasImage && (
        <View style={styles.imageWrapper}>
          <Image
            source={imageSource}
            style={styles.squareImage}
            resizeMode="cover"
          />
        </View>
      )}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
      alignSelf: "center",
      // marginTop: theme.spacing.xs,
    },
    imageWrapper: {
      width: "100%",
      aspectRatio: 1,
      alignSelf: "center",
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.s,
      borderRadius: 16,
      overflow: "hidden",
    },
    squareImage: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
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
}

export default Card;

// Some Example Usages of this Card Component:

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
