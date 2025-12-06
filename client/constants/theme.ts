import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#5C4033",
    textSecondary: "#8B7355",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A9A9A9",
    tabIconSelected: "#8FBC8F",
    link: "#8FBC8F",
    backgroundRoot: "#FFFAF0",
    backgroundDefault: "#FFF8DC",
    backgroundSecondary: "#F5ECD3",
    backgroundTertiary: "#EBE1C8",
    sage: "#8FBC8F",
    sandyBrown: "#F4A460",
    skyBlue: "#87CEEB",
    cornsilk: "#FFF8DC",
    warmWhite: "#FFFAF0",
    darkWood: "#5C4033",
    gold: "#FFD700",
    mutedRed: "#CD5C5C",
    lockGray: "#A9A9A9",
    border: "#E8DCC8",
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
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
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

export const Shadows = {
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
