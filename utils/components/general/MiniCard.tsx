import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SmallCardProps = {
  title: string;
  description: string;
  backgroundColor?: string;
  mode?: "light" | "dark";
  textColor?: string;
  borderRadius?: number;
  padding?: number;
  callback?: () => void;
  // New props for handling both image and icon
  imageSource?: any;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
};

const SmallCard: React.FC<SmallCardProps> = ({
  title,
  description,
  backgroundColor,
  mode = "dark",
  textColor = "#ffffff",
  borderRadius = 16,
  padding = 16,
  callback,
  imageSource,
  iconName,
  iconSize = 32,
  iconColor,
}) => {
  const defaultBackground =
    backgroundColor || (mode === "dark" ? "#1A1A1A" : "#f0f0f0");
  const defaultTextColor = mode === "dark" ? "#ffffff" : "#000000";
  const finalTextColor = textColor || defaultTextColor;

  return (
    <TouchableOpacity
      onPress={callback}
      activeOpacity={callback ? 0.8 : 1}
      style={[
        styles.card,
        { backgroundColor: defaultBackground, borderRadius, padding },
      ]}
    >
      <View style={styles.mediaContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        ) : iconName ? (
          <Ionicons
            name={iconName}
            size={iconSize}
            color={iconColor || finalTextColor}
          />
        ) : null}
      </View>
      <Text style={[styles.title, { color: finalTextColor }]}>{title}</Text>
      <Text style={[styles.description, { color: finalTextColor }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    margin: 8,
    width: "44%", // Takes up slightly less than half width to account for margins
    alignSelf: "center",
  },
  mediaContainer: {
    width: "100%",
    height: 100, // Half the height of the original card
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default SmallCard;
