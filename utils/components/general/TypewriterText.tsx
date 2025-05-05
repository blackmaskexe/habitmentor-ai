import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

interface TypewriterTextProps {
  textContent: string;
  typingSpeed?: number;
  heading?: boolean;
  title?: string;
}

export default function TypewriterText({
  textContent,
  typingSpeed = 0.5,
  heading = false,
  title = "",
}: TypewriterTextProps) {
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
  const speed = 150 - typingSpeed * 150;

  useEffect(() => {
    if (currentIndex < textContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + textContent[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      textComplete.current = true;
    }
  }, [currentIndex, textContent, speed]);

  return (
    <View style={styles.container}>
      {heading && title && <Text style={styles.heading}>{title}</Text>}

      <View style={{ height: textHeight, width: "100%" }}>
        <Text style={styles.description}>{displayedText}</Text>

        {/* Invisible text to measure */}
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
      padding: theme.spacing.m,
    },
    heading: {
      ...theme.text.h1,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    description: {
      ...theme.text.h3,
      color: theme.colors.textSecondary,
      width: "100%",
      textAlign: "center",
    },
    hiddenText: {
      position: "absolute",
      opacity: 0,
    },
  });
}
