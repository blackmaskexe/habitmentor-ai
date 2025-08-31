import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// import TypewriterText from "./TypewriterText";

const { width, height } = Dimensions.get("window");

interface LoginScreenProps {
  /** App logo source */
  logoSource?: ImageSourcePropType;
  /** Logo size (width and height) */
  logoSize?: number;
  /** Primary app color */
  primaryColor?: string;
  /** Text to display above login options */
  promptText?: string;
  /** Text for login button */
  loginButtonText?: string;
  /** Text for signup button */
  signupButtonText?: string;
  /** Called when login button is pressed */
  onLoginPress: () => void;
  /** Called when signup button is pressed */
  onSignupPress: () => void;
  /** Optional additional message below buttons */
  footerText?: string;
}

const Login: React.FC<LoginScreenProps> = ({
  logoSource,
  logoSize = width * 0.4,
  primaryColor = "#007AFF",
  promptText = "Welcome to Gains Chat, A Workout Logging App with AI Chat",
  loginButtonText = "Log In",
  signupButtonText = "Sign Up",
  onLoginPress,
  onSignupPress,
  footerText,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
            resizeMode="contain"
          />
        </View>

        {/* Prompt Text */}
        {/* <TypewriterText
          textContent={promptText}
          typingSpeed={0.95}
          heading={true}
        /> */}

        {/* Auth Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={onLoginPress}
          >
            <Text style={styles.buttonText}>{loginButtonText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.outlineButton,
              { borderColor: primaryColor },
            ]}
            onPress={onSignupPress}
          >
            <Text style={[styles.buttonText, { color: primaryColor }]}>
              {signupButtonText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Optional Footer Text */}
        {footerText && <Text style={styles.footerText}>{footerText}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: height * 0.08,
    alignItems: "center",
  },
  logo: {
    // Size is controlled by props
  },
  promptText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    color: "#333333",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 30,
    color: "#888888",
    textAlign: "center",
  },
});

export default Login;
