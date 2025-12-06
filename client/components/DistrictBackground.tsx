import React from "react";
import { View, StyleSheet } from "react-native";
import { DistrictId } from "@/lib/gameData";
import { Colors } from "@/constants/theme";

interface DistrictBackgroundProps {
  districtId: DistrictId;
}

const DISTRICT_GRADIENTS: Record<DistrictId, { top: string; bottom: string }> = {
  forest: { top: "#B8E4C9", bottom: "#8FBC8F" },
  coastal: { top: "#87CEEB", bottom: "#5FAED8" },
  mountain: { top: "#D1D1E8", bottom: "#B8B8D1" },
  desert: { top: "#F4D4A4", bottom: "#F4A460" },
  skyline: { top: "#C8C8E8", bottom: "#A9A9C9" },
};

export function DistrictBackground({ districtId }: DistrictBackgroundProps) {
  const colors = DISTRICT_GRADIENTS[districtId];

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.topGradient, { backgroundColor: colors.top }]} />
      <View style={[styles.bottomSection, { backgroundColor: colors.bottom }]}>
        <View style={[styles.hills, { backgroundColor: colors.top }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    flex: 0.4,
  },
  bottomSection: {
    flex: 0.6,
    position: "relative",
  },
  hills: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    opacity: 0.5,
  },
});
