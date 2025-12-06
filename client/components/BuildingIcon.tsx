import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Building } from "@/lib/gameData";
import { Colors, BorderRadius } from "@/constants/theme";

interface BuildingIconProps {
  type: Building["iconType"];
  size?: number;
}

const BUILDING_ICONS: Record<Building["iconType"], { icon: keyof typeof Feather.glyphMap; bg: string }> = {
  cottage: { icon: "home", bg: "#8FBC8F" },
  bakery: { icon: "coffee", bg: "#F4A460" },
  lighthouse: { icon: "sun", bg: "#87CEEB" },
  windmill: { icon: "wind", bg: "#B8E4C9" },
  market: { icon: "shopping-cart", bg: "#5FAED8" },
  workshop: { icon: "tool", bg: "#A67B5B" },
  tavern: { icon: "users", bg: "#C49A6C" },
  observatory: { icon: "star", bg: "#6B5B95" },
  pyramid: { icon: "triangle", bg: "#D4A574" },
  oasis: { icon: "droplet", bg: "#20B2AA" },
  cactus: { icon: "feather", bg: "#2E8B57" },
  skyscraper: { icon: "layers", bg: "#708090" },
  fountain: { icon: "droplet", bg: "#4682B4" },
  cafe: { icon: "coffee", bg: "#8B4513" },
  hotel: { icon: "briefcase", bg: "#483D8B" },
};

export function BuildingIcon({ type, size = 60 }: BuildingIconProps) {
  const config = BUILDING_ICONS[type];

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: BorderRadius.md,
          backgroundColor: config.bg,
        },
      ]}
    >
      <Feather name={config.icon} size={size * 0.5} color={Colors.light.warmWhite} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.light.darkWood,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
