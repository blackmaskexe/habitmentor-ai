import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

interface CollageItem {
  id: string;
  aspectRatio?: number; // width/height ratio (optional)
  minHeight?: number;
  maxHeight?: number;
  content: React.ReactNode; // The actual card/content to render
}

interface CollageGridProps {
  items: CollageItem[];
  numColumns?: number;
  spacing?: number;
  containerPadding?: number;
  minCardHeight?: number;
  maxCardHeight?: number;
  randomSeed?: string; // For consistent randomization
}

const CollageGrid: React.FC<CollageGridProps> = ({
  items,
  numColumns = 2,
  spacing = 8,
  containerPadding = 16,
  minCardHeight = 120,
  maxCardHeight = 280,
  randomSeed = "default",
}) => {
  const { width: screenWidth } = Dimensions.get("window");

  // Calculate available width for cards
  const availableWidth =
    screenWidth - containerPadding * 2 - spacing * (numColumns - 1);
  const cardWidth = availableWidth / numColumns;

  // Generate consistent random heights based on seed
  const itemsWithDimensions = useMemo(() => {
    // Simple seeded random function
    const seededRandom = (seed: string, index: number) => {
      const str = seed + index.toString();
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash) / 2147483647; // Normalize to 0-1
    };

    return items.map((item, index) => {
      const random = seededRandom(randomSeed, index);

      let height: number;

      if (item.aspectRatio) {
        // Use provided aspect ratio
        height = cardWidth / item.aspectRatio;
      } else {
        // Use random height within bounds
        const itemMinHeight = item.minHeight || minCardHeight;
        const itemMaxHeight = item.maxHeight || maxCardHeight;
        height = itemMinHeight + random * (itemMaxHeight - itemMinHeight);
      }

      return {
        ...item,
        width: cardWidth,
        height: Math.round(height),
      };
    });
  }, [items, cardWidth, minCardHeight, maxCardHeight, randomSeed]);

  // Distribute items across columns (masonry layout)
  const columns = useMemo(() => {
    const cols: Array<Array<(typeof itemsWithDimensions)[0]>> = Array.from(
      { length: numColumns },
      () => []
    );
    const colHeights = Array(numColumns).fill(0);

    itemsWithDimensions.forEach((item) => {
      // Find the shortest column
      const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));

      // Add item to shortest column
      cols[shortestColIndex].push(item);
      colHeights[shortestColIndex] += item.height + spacing;
    });

    return cols;
  }, [itemsWithDimensions, numColumns, spacing]);

  return (
    <View style={[styles.container, { padding: containerPadding }]}>
      <View style={[styles.grid, { gap: spacing }]}>
        {columns.map((column, columnIndex) => (
          <View key={columnIndex} style={[styles.column, { gap: spacing }]}>
            {column.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    width: item.width,
                    height: item.height,
                  },
                ]}
              >
                {item.content}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  card: {
    overflow: "hidden",
  },
});

export default CollageGrid;
