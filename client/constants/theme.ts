import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#2D3748",
    textSecondary: "#718096",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A0AEC0",
    tabIconSelected: "#FF6B9D",
    link: "#00C9FF",
    backgroundRoot: "#E8F4FD",
    backgroundDefault: "#E8F4FD",
    backgroundSecondary: "#D4E9F7",
    backgroundTertiary: "#C0DEF0",
    sage: "#00E676",
    sandyBrown: "#FFB74D",
    skyBlue: "#00C9FF",
    cornsilk: "#FFF9E6",
    warmWhite: "#FFFBF0",
    darkWood: "#5D4E37",
    gold: "#FFD700",
    mutedRed: "#FF6B6B",
    lockGray: "#9E9E9E",
    border: "#B8D4E8",
    purple: "#BB6BD9",
    mint: "#1DE9B6",
    pink: "#FF6B9D",
    orange: "#FF9F43",
  },
  dark: {
    text: "#FFF8DC",
    textSecondary: "#D4C9B5",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#8FBC8F",
    link: "#8FBC8F",
    backgroundRoot: "#2A2218",
    backgroundDefault: "#3A3228",
    backgroundSecondary: "#4A4238",
    backgroundTertiary: "#5A5248",
    sage: "#8FBC8F",
    sandyBrown: "#F4A460",
    skyBlue: "#87CEEB",
    cornsilk: "#FFF8DC",
    warmWhite: "#FFFAF0",
    darkWood: "#5C4033",
    gold: "#FFD700",
    mutedRed: "#CD5C5C",
    lockGray: "#6B6B6B",
    border: "#4A4238",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
  touchableMin: 44,
};

export const BorderRadius = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 36,
  "2xl": 44,
  "3xl": 60,
  full: 9999,
  cartoon: 50, // Extra bubbly for cartoon style
};

export const Typography = {
  hero: {
    fontSize: 48,
    fontWeight: "700" as const,
    fontFamily: "FredokaOne",
  },
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    fontFamily: "FredokaOne",
  },
  h2: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "FredokaOne",
  },
  h3: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "FredokaOne",
  },
  h4: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "FredokaOne",
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    fontFamily: "Nunito",
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
    fontFamily: "Nunito",
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    fontFamily: "Nunito",
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Nunito",
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
    fontFamily: "Nunito",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "Nunito",
    heading: "FredokaOne",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "Nunito",
    heading: "FredokaOne",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Nunito, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    heading: "Fredoka One, system-ui, sans-serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Cartoon-style dramatic shadows
export const Shadows = {
  cartoon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cartoonSmall: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  floating: {
    shadowColor: "#5C4033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};
