import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { District, DistrictId } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface DistrictBadgeProps {
  district: District;
  isUnlocked: boolean;
}

const DISTRICT_COLORS: Record<DistrictId, string> = {
  forest: "#8FBC8F",
  coastal: "#87CEEB",
  mountain: "#B8B8D1",
  desert: "#F4A460",
  skyline: "#A9A9C9",
};

export function DistrictBadge({ district, isUnlocked }: DistrictBadgeProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isUnlocked
            ? DISTRICT_COLORS[district.id]
            : Colors.light.lockGray,
          opacity: isUnlocked ? 1 : 0.5,
        },
      ]}
    >
      {isUnlocked ? (
        <Feather name="check" size={14} color={Colors.light.warmWhite} />
      ) : (
        <Feather name="lock" size={14} color={Colors.light.warmWhite} />
      )}
      <ThemedText style={styles.text} numberOfLines={1}>
        {district.name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
    color: Colors.light.warmWhite,
  },
});
