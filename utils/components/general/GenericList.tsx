/**
 * GenericList Component
 *
 * A configurable list component that supports multiple bullet styles and customizations.
 *
 * @prop {ListItem[]} items - Array of list items to display
 * @prop {number} spacing - Vertical spacing between list items (default: theme.spacing.m)
 * @prop {string} textColor - Color of the list text (default: theme.colors.text)
 * @prop {number} bulletSize - Size of the bullet (default: 6)
 * @prop {'left' | 'right'} bulletAlign - Alignment of bullet relative to text (default: 'left')
 *
 * ListItem structure:
 * {
 *   listText: string;
 *   bullet: {
 *     type: 'icon' | 'standard' | 'text' | 'number';
 *     favicon?: string;     // Required when type is 'icon'
 *     bulletText?: string;  // Required when type is 'text'
 *   }
 * }
 *
 * Example usage:
 * const items = [
 *   {
 *     listText: "First item",
 *     bullet: { type: "icon", favicon: "star" }
 *   },
 *   {
 *     listText: "Second item",
 *     bullet: { type: "standard" }
 *   },
 *   {
 *     listText: "Third item",
 *     bullet: { type: "text", bulletText: "→" }
 *   }
 * ];
 *
 * <GenericList items={items} spacing={16} bulletSize={8} />
 */

import { useTheme } from "@/utils/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type BulletConfig = any;
type ListItem = any;
type GenericListProps = any;

export default function GenericList({
  items,
  spacing,
  textColor,
  textSize,
  bulletSize = 6,
  bulletAlign = "left",
}: {
  items: any[];
  spacing?: number;
  textColor?: string;
  textSize?: number;
  bulletSize?: number;
  bulletAlign?: "left" | "right";
}) {
  const theme: any = useTheme();
  const styles = createStyles(theme, spacing, textColor, bulletSize, textSize);

  const renderBullet = (bullet: any, index: number) => {
    switch (bullet.type) {
      case "icon":
        return (
          <View style={styles.bulletWrapper}>
            <Ionicons
              name={bullet.favicon}
              size={bulletSize * 2}
              color={textColor || theme.colors.text}
            />
          </View>
        );
      case "standard":
        return <View style={[styles.bulletWrapper, styles.bullet]} />;
      case "text":
        return (
          <View style={styles.bulletWrapper}>
            <Text style={styles.bulletText}>{bullet.bulletText}</Text>
          </View>
        );
      case "number":
        return (
          <View style={styles.bulletWrapper}>
            <Text style={styles.bulletText}>{`${index + 1}.`}</Text>
          </View>
        );
      default:
        return <View style={[styles.bulletWrapper, styles.bullet]} />;
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item: any, index: number) => (
        <View key={index} style={styles.listItem}>
          {renderBullet(item.bullet, index)}
          <View style={styles.textContainer}>
            <Text style={styles.text}>{item.listText}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles(
  theme: any,
  customSpacing?: any,
  customTextColor?: any,
  bulletSize: any = 6,
  fontSize: number = 14
) {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    listItem: {
      flexDirection: "row",
      marginBottom: customSpacing || theme.spacing.m,
      alignItems: "flex-start", // Align items to top
    },
    bulletWrapper: {
      width: bulletSize * 3,
      alignItems: "center",
      paddingTop: 2, // Slight offset to align with first line of text
      marginRight: theme.spacing.s,
    },
    textContainer: {
      flex: 1,
    },
    bullet: {
      width: bulletSize,
      height: bulletSize,
      borderRadius: bulletSize / 2,
      backgroundColor: customTextColor || theme.colors.text,
    },
    bulletText: {
      ...theme.text.body,
      color: customTextColor || theme.colors.text,
    },
    text: {
      fontSize: fontSize,
      fontWeight: "500",
      color: customTextColor || theme.colors.text,
      flexWrap: "wrap",
    },
  });
}
