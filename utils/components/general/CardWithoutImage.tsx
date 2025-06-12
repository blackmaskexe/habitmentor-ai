import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";

const screenWidth = Dimensions.get("window").width;

type CardProps = {
  title: string;
  description?: string;
  borderRadius?: number;
  metadata?: string;
  padding?: number;
  onPress?: any;
  children?: any;
};

const CardWithoutImage: React.FC<CardProps> = ({
  title,
  description,
  borderRadius = 16,
  padding = 16,
  onPress,
  children,
  metadata,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const hasChildren = React.Children.count(children) > 0;
  // we use this property to determine how we want to style the height of our CardWithoutImage component

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
      activeOpacity={onPress ? 0.3 : 1}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.altBackground,
          borderRadius,
          padding,
          height: hasChildren ? "auto" : 90,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{title[0].toUpperCase()}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {description && description.trim().length > 0 ? (
            <Text
              style={styles.description}
              numberOfLines={1}
              ellipsizeMode="tail" // ... when the length of the text is too long
            >
              {description}
            </Text>
          ) : null}
          {metadata && metadata.trim().length > 0 ? (
            <Text
              style={styles.metadata}
              numberOfLines={1}
              ellipsizeMode="tail" // ... when the length of the text is too long
            >
              {metadata}
            </Text>
          ) : null}
        </View>
      </View>
      {hasChildren && <View style={styles.childrenContainer}>{children}</View>}
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
      margin: 10,
      width: "95%", // Takes up 95% of parent width
      alignSelf: "center",
    },

    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.colors.text,
    },
    description: {
      fontSize: 14,
      opacity: 0.8,
      color: theme.colors.text,
    },
    metadata: {
      fontSize: 14,
      opacity: 0.8,
      color: theme.colors.textSecondary,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary, // Constant grey color
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    iconText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
    textContainer: {
      flex: 1,
    },
    childrenContainer: {
      width: "100%",
      paddingTop: 8, // Space between header and children
      // borderTopWidth: 1,
      borderTopColor: "rgba(0,0,0,0.1)", // Light separator line
    },
    centeredTextContainer: {
      justifyContent: "center", // Center vertically when no description
    },
  });
}

export default CardWithoutImage;
