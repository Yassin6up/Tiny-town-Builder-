import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { StoneTextureSvg } from "@/components/textures";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardTexture}>
        <StoneTextureSvg width={180} height={120} variant="gray" borderRadius={12} />
      </View>
      <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Feather name={icon} size={18} color={Colors.light.warmWhite} />
      </View>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "47%",
    position: "relative",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#5C5C5C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  cardTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  value: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: Colors.light.darkWood,
  },
  label: {
    fontFamily: "Nunito",
    fontSize: 12,
    color: Colors.light.darkWood,
    opacity: 0.7,
    marginTop: 2,
  },
});
