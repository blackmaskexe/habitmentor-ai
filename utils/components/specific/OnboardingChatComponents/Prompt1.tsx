import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Prompt1 = ({ message }: { message: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  bubble: {
    backgroundColor: "#E5E5EA",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxWidth: "80%",
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
});

export default Prompt1;
