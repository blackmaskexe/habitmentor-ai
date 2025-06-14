export const lightTheme = {
  theme: "light",
  colors: {
    // Core colors
    primary: "#007AFF",
    background: "#FFFFFF",
    altBackground: "#ececec", // used for background for modal
    surface: "#f0f0f0", // for, for example, cards and shi, stuff that you want to make elevated
    text: "#1a1a1a",
    textSecondary: "#333333",
    textTertiary: "#c6c6c0",
    shadow: "rgba(0,0,0,0.2)",
    placeholder: "rgba(51, 51, 51, 0.5)",

    // Functional colors
    border: "#E8F7EE",
    error: "#FF3B30",
    success: "#34C759",

    // Component specific
    card: "#FFFFFF",
    input: "#F6F6F6",
    tabBar: "#FFFFFF",
  },

  button: {
    background: "#007AFF",
    disabledBackground: "#E0E0E0",
    shadowColor: "#000",
    textColor: "#fff",
    textSize: 20,
    width: {
      s: "50%",
      m: "70%",
      l: "90%",
    },
  },

  toggle: {
    track: {
      enabled: "#007AFF",
      disabled: "#D1D1D6",
    },
    knob: {
      background: "#FFFFFF",
      shadow: "rgba(0,0,0,0.2)",
    },
  },

  // Simplified typography
  text: {
    h1: { fontSize: 32, fontWeight: 700 as any },
    h2: { fontSize: 24, fontWeight: 600 as any },
    h3: { fontSize: 20, fontWeight: 500 as any },
    body: { fontSize: 16, fontWeight: 400 as any },
    small: { fontSize: 14, fontWeight: 400 as any },
  },

  // Common spacing
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },

  // Simplified radius
  radius: {
    s: 8,
    m: 12,
    l: 16,
    round: 9999,
  },
};

export const darkTheme = {
  theme: "dark",
  colors: {
    // Core colors
    primary: "#FF6347",
    background: "#151515",
    altBackground: "#2A2A2A", // used for background for modal
    surface: "#2C2C2C",
    text: "#F5F5F5",
    textSecondary: "#798086",
    textTertiary: "#c6c6c0",
    shadow: "rgba(0,0,0,0.5)",
    placeholder: "rgba(120, 120, 120)",

    // Functional colors
    border: "#3D3D3D",
    error: "#FF453A",
    success: "#32D74B",

    // Component specific
    card: "#262626",
    input: "#363636",
    tabBar: "#1A1A1A",
  },

  button: {
    background: "#FF6347",
    disabledBackground: "#E0E0E0",
    shadowColor: "#fff",
    textColor: "#fff",
    textSize: 20,
    width: {
      s: "50%",
      m: "70%",
      l: "90%",
    },
  },

  toggle: {
    track: {
      enabled: "#FF6347",
      disabled: "#555555",
    },
    knob: {
      background: "#FFFFFF",
      shadow: "rgba(0,0,0,0.5)",
    },
  },

  // Reuse other properties
  text: lightTheme.text,
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
};

// Type definitions
export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;
