import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BuildingIconType, BuildingTier } from "@/lib/gameData";
import { Colors, BorderRadius } from "@/constants/theme";

interface BuildingIconProps {
  type: BuildingIconType;
  tier?: BuildingTier;
  size?: number;
}

const BUILDING_ICONS: Record<BuildingIconType, { icon: keyof typeof Feather.glyphMap; bg: string }> = {
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
  apiary: { icon: "hexagon", bg: "#FFD700" },
  treehouse: { icon: "git-branch", bg: "#228B22" },
  shipyard: { icon: "anchor", bg: "#4169E1" },
  marina: { icon: "navigation", bg: "#00CED1" },
  skiLodge: { icon: "map-pin", bg: "#B0C4DE" },
  icePalace: { icon: "octagon", bg: "#E0FFFF" },
  bazaar: { icon: "shopping-bag", bg: "#CD853F" },
  sultanPalace: { icon: "award", bg: "#DAA520" },
  rooftopGarden: { icon: "sunrise", bg: "#32CD32" },
  penthouse: { icon: "aperture", bg: "#9370DB" },
};

const TIER_COLORS: Record<BuildingTier, { border: string; glow: string }> = {
  common: { border: "transparent", glow: "transparent" },
  rare: { border: "#5DADE2", glow: "rgba(93, 173, 226, 0.4)" },
  legendary: { border: "#F4D03F", glow: "rgba(244, 208, 63, 0.5)" },
};

export function BuildingIcon({ type, tier = "common", size = 60 }: BuildingIconProps) {
  const config = BUILDING_ICONS[type];
  const tierStyle = TIER_COLORS[tier];

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: BorderRadius.md,
          backgroundColor: config.bg,
          borderWidth: tier !== "common" ? 3 : 0,
          borderColor: tierStyle.border,
        },
        tier !== "common" && {
          shadowColor: tierStyle.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
      ]}
    >
      <Feather name={config.icon} size={size * 0.5} color={Colors.light.warmWhite} />
      {tier === "legendary" ? (
        <View style={[styles.tierIndicator, styles.legendaryIndicator]}>
          <Feather name="star" size={10} color="#FFD700" />
        </View>
      ) : tier === "rare" ? (
        <View style={[styles.tierIndicator, styles.rareIndicator]}>
          <Feather name="zap" size={10} color="#5DADE2" />
        </View>
      ) : null}
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
  tierIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  rareIndicator: {
    backgroundColor: "#1A5276",
  },
  legendaryIndicator: {
    backgroundColor: "#7D6608",
  },
});
