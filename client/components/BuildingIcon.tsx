import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
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

// Map building types to PNG images - NO MORE LOTTIE
const PNG_IMAGES: Partial<Record<BuildingIconType, any>> = {
  // Forest district
  cottage: require("../../assets/model/forest map/house.png"),
  bakery: require("../../assets/model/forest map/breed house.png"),
  windmill: require("../../assets/model/forest map/windmill.png"),
  apiary: require("../../assets/model/forest map/bee house.png"),
  treehouse: require("../../assets/model/forest map/tree house.png"),
  
  // Coastal district
  lighthouse: require("../../assets/model/coastal map/Lighthouse.png"),
  market: require("../../assets/model/coastal map/fishmarket.png"),
  workshop: require("../../assets/model/coastal map/boatrepair.png"),
  shipyard: require("../../assets/model/coastal map/RoyalShipyard.png"),
  marina: require("../../assets/model/coastal map/CrystalMarina.png"),
  
  // Mountain district
  tavern: require("../../assets/model/montain map/MountainTavern.png"),
  observatory: require("../../assets/model/montain map/StarObservatory.png"),
  cafe: require("../../assets/model/montain map/AlpineCafe.png"),
  skiLodge: require("../../assets/model/montain map/CozySkiLodge.png"),
  icePalace: require("../../assets/model/montain map/IceCrystalPalace.png"),
  
  // Desert district
  pyramid: require("../../assets/model/disser map/AncientPyramid.png"),
  oasis: require("../../assets/model/disser map/OasisWell.png"),
  cactus: require("../../assets/model/disser map/CactusFarm.png"),
  bazaar: require("../../assets/model/disser map/ExoticBazaar.png"),
  sultanPalace: require("../../assets/model/disser map/sultan.png"),
  
  // Skyline/City district
  skyscraper: require("../../assets/model/city map/GlassTower.png"),
  fountain: require("../../assets/model/city map/GrandFountain.png"),
  hotel: require("../../assets/model/city map/hotel.png"),
  rooftopGarden: require("../../assets/model/city map/skyGarden.png"),
  penthouse: require("../../assets/model/city map/diamondhouse.png"),
};

// Map building types to OBJ 3D models - REMOVED (using Lottie instead)
const OBJ_MODELS: Partial<Record<BuildingIconType, any>> = {
  // Skyline buildings - will add Lottie animations later
  // skyscraper: require("../../assets/model/city map/Bar/Bar.obj"),
  // fountain: require("../../assets/model/city map/CandyShop/CandyShop.obj"),
  // hotel: require("../../assets/model/city map/Casino/Casino.obj"),
  // rooftopGarden: require("../../assets/model/city map/PizzaPlace/PizzaPlace.obj"),
  // penthouse: require("../../assets/model/city map/Supermarket/Market.obj"),
};

// Map building types to voxel PNG renders
// Note: Current PNG files are invalid (only show a thin line)
// Using OBJ models instead
const VOXEL_IMAGES: Partial<Record<BuildingIconType, any>> = {
  // Disabled - using OBJ 3D models now
};

// Enhanced styling for Skyline buildings to look more 3D
const ENHANCED_SKYLINE_STYLES: Partial<Record<BuildingIconType, { gradient: [string, string]; icon: keyof typeof Feather.glyphMap; shadowColor: string }>> = {
  skyscraper: { 
    gradient: ["#5F9EA0", "#2F4F4F"], 
    icon: "home",
    shadowColor: "#1C1C1C"
  },
  fountain: { 
    gradient: ["#FF69B4", "#C71585"], 
    icon: "droplet",
    shadowColor: "#8B008B"
  },
  hotel: { 
    gradient: ["#9370DB", "#6A5ACD"], 
    icon: "star",
    shadowColor: "#483D8B"
  },
  rooftopGarden: { 
    gradient: ["#32CD32", "#228B22"], 
    icon: "package",
    shadowColor: "#006400"
  },
  penthouse: { 
    gradient: ["#FFD700", "#FF8C00"], 
    icon: "award",
    shadowColor: "#B8860B"
  },
};

const TIER_COLORS: Record<BuildingTier, { border: string; glow: string }> = {
  common: { border: "transparent", glow: "transparent" },
  rare: { border: "#9F7AEA", glow: "rgba(159, 122, 234, 0.4)" },
  legendary: { border: "#F6E05E", glow: "rgba(246, 224, 94, 0.5)" },
};

export function BuildingIcon({ type, tier = "common", size = 60 }: BuildingIconProps) {
  const config = BUILDING_ICONS[type];
  const tierStyle = TIER_COLORS[tier];
  const pngImage = PNG_IMAGES[type];
  const objModel = OBJ_MODELS[type];
  const voxelImage = VOXEL_IMAGES[type];
  const enhancedStyle = ENHANCED_SKYLINE_STYLES[type];

  // PNG images render without container boxes
  if (pngImage) {
    return (
      <Image
        source={pngImage}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: BorderRadius.md,
          borderWidth: tier !== "common" ? 3 : 0,
          borderColor: tierStyle.border,
          overflow: "hidden",
          backgroundColor: voxelImage ? "#F7FAFC" : (enhancedStyle ? "transparent" : config.bg),
        },
        tier !== "common" && {
          shadowColor: tierStyle.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
      ]}
    >
      {voxelImage ? (
        <Image
          source={voxelImage}
          style={{
            width: size,
            height: size,
          }}
          contentFit="contain"
          transition={200}
          placeholder={null}
        />
      ) : enhancedStyle ? (
        <LinearGradient
          colors={enhancedStyle.gradient}
          style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Main building icon */}
          <View style={{ 
            width: size * 0.7, 
            height: size * 0.7,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 8,
            shadowColor: enhancedStyle.shadowColor,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <Feather name={enhancedStyle.icon} size={size * 0.45} color="#FFFFFF" />
          </View>
          
          {/* 3D cube indicator */}
          <View style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 12,
            padding: 4,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.3)",
          }}>
            <Feather name="box" size={10} color="#FFFFFF" />
          </View>
        </LinearGradient>
      ) : (
        <View style={{ 
          width: size, 
          height: size, 
          backgroundColor: config.bg,
          justifyContent: "center", 
          alignItems: "center" 
        }}>
          <Feather name={config.icon} size={size * 0.5} color={Colors.light.warmWhite} />
        </View>
      )}
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
