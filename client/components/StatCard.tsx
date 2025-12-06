import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Feather name={icon} size={18} color={Colors.light.warmWhite} />
      </View>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "47%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    ...Shadows.card,
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
