import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

interface TypewriterTextProps {
  textContent: string;
  typingSpeed?: number;
  // heading prop is no longer used as title is removed
}

export default function TypewriterText({
  textContent,
  typingSpeed = 0.5,
}: TypewriterTextProps) {
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    textComplete.current = false;
    // Optionally, if textHeight should also reset (e.g., if new text could be shorter)
    // setTextHeight(0); // This might cause a flicker, test thoroughly
  }, [textContent]);

  const theme = useTheme();
  const styles = createStyles(theme);

  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const textComplete = useRef(false);

  // Get layout dimensions with onLayout
  const onTextLayout = (event: any) => {
    if (!textComplete.current) {
      setTextHeight(event.nativeEvent.layout.height);
    }
  };

  // Convert typingSpeed (0-1) to milliseconds
  const speed = 150 - typingSpeed * 150; // Lower value means faster typing

  useEffect(() => {
    if (currentIndex < textContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + textContent[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      textComplete.current = true; // Mark as complete to stop onLayout updates
    }
  }, [currentIndex, textContent, speed]);

  return (
    <View style={styles.container}>
      {/* Heading/title rendering removed */}

      {/* Container to hold the text and maintain height */}
      <View
        style={{
          height: textHeight > 0 ? textHeight : undefined,
          width: "100%",
        }}
      >
        <Text style={styles.description}>{displayedText}</Text>

        {/* Invisible text to measure the full height of textContent */}
        <Text
          style={[styles.description, styles.hiddenText]}
          onLayout={onTextLayout}
        >
          {textContent}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      width: "100%",
      // padding: theme.spacing.m,
    },
    // heading style is no longer used
    description: {
      // Assuming theme.text.body is smaller than theme.text.h3
      // If theme.text.body doesn't exist or isn't smaller,
      // you might need to adjust fontSize directly, e.g., fontSize: theme.text.h3.fontSize * 0.8
      ...theme.text.body, // Changed from h3 to body for smaller text
      color: theme.colors.textSecondary,
      width: "100%",
      textAlign: "left",
    },
    hiddenText: {
      position: "absolute",
      opacity: 0,
      // Ensure it doesn't affect user interaction
      zIndex: -1,
      pointerEvents: "none",
    },
  });
}
