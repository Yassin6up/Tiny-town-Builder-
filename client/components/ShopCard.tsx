import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { BuildingIcon } from "@/components/BuildingIcon";
import { CoinIcon } from "@/components/CoinIcon";
import { Building, formatNumber, getBuildingCost } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface ShopCardProps {
  building: Building;
  isLocked: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ShopCard({
  building,
  isLocked,
  canAfford,
  onBuy,
  onPress,
}: ShopCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const cost = getBuildingCost(building);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault, opacity: isLocked ? 0.6 : 1 },
        animatedStyle,
      ]}
    >
      <View style={styles.iconWrapper}>
        <BuildingIcon type={building.iconType} size={70} />
        {isLocked ? (
          <View style={styles.lockOverlay}>
            <Feather name="lock" size={24} color={Colors.light.warmWhite} />
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.buildingName}>{building.name}</ThemedText>
          {building.owned > 0 ? (
            <View style={[styles.ownedBadge, { backgroundColor: theme.sage }]}>
              <ThemedText style={styles.ownedText}>x{building.owned}</ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText style={styles.description}>{building.description}</ThemedText>
        <View style={styles.incomeRow}>
          <Feather name="trending-up" size={14} color={theme.gold} />
          <ThemedText style={styles.incomeText}>
            +{formatNumber(building.baseIncome)}/sec
          </ThemedText>
        </View>
      </View>

      <View style={styles.buySection}>
        <View style={styles.costRow}>
          <CoinIcon size={18} />
          <ThemedText
            style={[
              styles.costText,
              { color: canAfford ? theme.gold : theme.mutedRed },
            ]}
          >
            {formatNumber(cost)}
          </ThemedText>
        </View>
        <Pressable
          onPress={isLocked ? undefined : onBuy}
          disabled={isLocked || !canAfford}
          style={[
            styles.buyButton,
            {
              backgroundColor:
                isLocked || !canAfford ? theme.lockGray : theme.sage,
            },
          ]}
        >
          <ThemedText style={styles.buyButtonText}>
            {isLocked ? "Locked" : "Buy"}
          </ThemedText>
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  iconWrapper: {
    position: "relative",
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buildingName: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: Colors.light.darkWood,
  },
  ownedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ownedText: {
    fontFamily: "Nunito-Bold",
    fontSize: 12,
    color: Colors.light.warmWhite,
  },
  description: {
    fontFamily: "Nunito",
    fontSize: 13,
    color: Colors.light.darkWood,
    opacity: 0.7,
    marginTop: 2,
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  incomeText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
    color: Colors.light.gold,
  },
  buySection: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  costText: {
    fontFamily: "FredokaOne",
    fontSize: 14,
  },
  buyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minWidth: 60,
    alignItems: "center",
  },
  buyButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.light.warmWhite,
  },
});
