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
import { WoodTextureSvg, GoldTextureSvg } from "@/components/textures";

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
    <View style={styles.cardWrapper}>
      <View style={styles.cardTexture}>
        <WoodTextureSvg 
          width={380} 
          height={140} 
          variant={isLocked ? "dark" : "light"} 
          borderRadius={28} 
        />
      </View>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, animatedStyle]}
      >
      <View style={styles.iconWrapper}>
        <BuildingIcon type={building.iconType} tier={building.tier} size={110} />
        {isLocked ? (
          <View style={styles.lockOverlay}>
            <Feather name="lock" size={32} color="#FFFFFF" />
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.buildingName}>{building.name}</ThemedText>
          {building.tier !== "common" ? (
            <View
              style={[
                styles.tierBadge,
                building.tier === "legendary" ? styles.legendaryBadge : styles.rareBadge,
              ]}
            >
              <ThemedText style={styles.tierText}>
                {building.tier === "legendary" ? "⭐ Legendary" : "💎 Rare"}
              </ThemedText>
            </View>
          ) : null}
          {building.owned > 0 ? (
            <View style={[styles.ownedBadge, { backgroundColor: "#48BB78" }]}>
              <ThemedText style={styles.ownedText}>x{building.owned}</ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText style={styles.description}>{building.description}</ThemedText>
        <View style={styles.incomeRow}>
          <Feather name="trending-up" size={16} color="#48BB78" />
          <ThemedText style={styles.incomeText}>
            +{formatNumber(building.baseIncome)}/sec
          </ThemedText>
        </View>
      </View>

      <View style={styles.buySection}>
        <View style={styles.costRow}>
          <CoinIcon size={28} />
          <ThemedText
            style={[
              styles.costText,
              { color: canAfford ? "#F6AD55" : "#FC8181" },
            ]}
          >
            {formatNumber(cost)}
          </ThemedText>
        </View>
        <View style={styles.buyButtonWrapper}>
          <View style={styles.buyButtonTexture}>
            <GoldTextureSvg 
              width={120} 
              height={48} 
              variant={isLocked || !canAfford ? "bronze" : "bright"} 
              borderRadius={24} 
            />
          </View>
          <Pressable
            onPress={isLocked ? undefined : onBuy}
            disabled={isLocked || !canAfford}
            style={styles.buyButton}
          >
            <Feather name={isLocked ? "lock" : "shopping-cart"} size={16} color="#FFFFFF" />
            <ThemedText style={styles.buyButtonText}>
              {isLocked ? "Locked" : "Buy"}
            </ThemedText>
          </Pressable>
        </View>
      </View>
      </AnimatedPressable>
    </View>
  );
}



const styles = StyleSheet.create({
  cardWrapper: {
    position: "relative",
    borderRadius: 28,
    borderWidth: 4,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
    marginBottom: Spacing.md,
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
    flexDirection: "row",
    padding: Spacing.xl,
    borderRadius: 28,
  },

  iconWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#1F3250",
    borderRadius: BorderRadius.xl,
    borderWidth: 4,
    borderColor: "#FFEDC2",

    shadowColor: "#0E1A33",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: Spacing.lg,
    justifyContent: "center",
  },

  // NAME + DESCRIPTION ------------------
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },

  buildingName: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: "#FFF3D1",

    textShadowColor: "#1A2E57",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  description: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#C5D3E8",
    marginTop: 4,
  },

  // INCOME ROW
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },

  incomeText: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
    color: "#66E387",
    textShadowColor: "#1A2E57",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // BADGES ----------------------------
  ownedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#44C670",

    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#44C670",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  ownedText: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "white",
  },

  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  rareBadge: {
    backgroundColor: "#A06BFF",
  },

  legendaryBadge: {
    backgroundColor: "#FFD700",
  },

  tierText: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    color: "#1A1A1A",
  },

  // BUY SECTION ----------------------
  buySection: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.lg,
  },

  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  costText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  buyButtonWrapper: {
    position: "relative",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  buyButtonTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  buyButton: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },

  buyButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
