import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { useMusic } from "@/lib/MusicContext";
import { formatNumber, getBuildingCost, getUpgradeCost } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { DiamondIcon } from "@/components/DiamondIcon";
import { BuildingIcon } from "@/components/BuildingIcon";
import { Audio } from "expo-av";
import { CartoonButton } from "@/components/CartoonButton";
import { CartoonPanel } from "@/components/CartoonPanel";
import { BounceIn } from "@/components/CartoonAnimations";
import { WoodTextureSvg, GoldTextureSvg } from "@/components/textures";

const MAX_LEVEL = 5; // Maximum 5 stars

type RouteParams = RouteProp<RootStackParamList, "BuildingDetail">;

export default function BuildingDetailModal() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const { theme } = useTheme();
  const { state, buyBuilding, upgradeBuilding } = useGame();
  const { setMusicVolume } = useMusic();

  // Lower music volume when modal opens
  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5); // Restore volume when modal closes
    };
  }, [setMusicVolume]);

  const building = state.buildings.find(b => b.id === route.params.buildingId);
  const district = state.districts.find(d => d.id === building?.districtId);

  if (!building) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Building not found</ThemedText>
      </View>
    );
  }

  const cost = getBuildingCost(building);
  const upgradeCost = getUpgradeCost(building);
  
  // Diamond costs
  const diamondCostForBuilding = building.diamondCost ?? 0;
  const diamondCostForUpgrade = (building.level === 4) ? 3 : 0; // Level 4→5 requires 3 diamonds
  
  const canAffordBuy = state.coins >= cost && state.diamonds >= diamondCostForBuilding;
  const isMaxLevel = building.level >= MAX_LEVEL;
  const canAffordUpgrade = state.coins >= upgradeCost && state.diamonds >= diamondCostForUpgrade && building.owned > 0 && !isMaxLevel;
  const isLocked = !district?.unlocked;

  const incomePerBuilding = building.baseIncome * (district?.incomeMultiplier ?? 1) * (1 + (building.level - 1) * 0.5);
  const totalIncome = incomePerBuilding * building.owned;

  const handleBuy = async () => {
    if (isLocked || !canAffordBuy) return;
    const success = buyBuilding(building.id);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Play cash sound
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/cash.mp3'),
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.log('Failed to play cash sound:', error);
      }
    }
  };

  const handleUpgrade = async () => {
    if (!canAffordUpgrade) return;
    const success = upgradeBuilding(building.id);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Play cash sound
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/building.mp3'),
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.log('Failed to play cash sound:', error);
      }
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      {/* Card Style Building Info */}
      <View style={styles.buildingCard}>
        {/* Header Row with Icon, Name and Level Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.iconAndName}>
            <BuildingIcon type={building.iconType} size={48} />
            <ThemedText style={styles.buildingName}>{building.name}</ThemedText>
          </View>
          <View style={styles.levelBadge}>
            <ThemedText style={styles.levelText}>LV {building.level}</ThemedText>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Total Earnings:</ThemedText>
            <View style={styles.statValueRow}>
              <CoinIcon size={18} />
              <ThemedText style={styles.statValue}>
                {formatNumber(totalIncome * 3600)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Income / sec:</ThemedText>
            <View style={styles.statValueRow}>
              <CoinIcon size={18} />
              <ThemedText style={styles.incomeValue}>
                +{formatNumber(totalIncome)} / s
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Action Buttons */}
        {isLocked ? (
          <View style={styles.lockedNotice}>
            <Feather name="lock" size={20} color="#94A3B8" />
            <ThemedText style={styles.lockedText}>
              Unlock {district?.name} district first
            </ThemedText>
          </View>
        ) : (
          <View style={styles.actionSection}>
            <View style={styles.upgradeButtonWrapper}>
              <View style={styles.buttonTexture}>
                <GoldTextureSvg 
                  width={340} 
                  height={60} 
                  variant={canAffordUpgrade ? "bright" : "matte"} 
                  borderRadius={20} 
                />
              </View>
              <Pressable
                onPress={handleUpgrade}
                style={styles.upgradeButton}
                disabled={!canAffordUpgrade || building.level >= MAX_LEVEL}
              >
                <ThemedText style={styles.upgradeButtonText}>
                  {building.level >= MAX_LEVEL ? "Max Level" : "Upgrade"}
                </ThemedText>
                {building.level < MAX_LEVEL && (
                  <View style={styles.costBadge}>
                    <CoinIcon size={16} />
                    <ThemedText style={styles.costText}>
                      {formatNumber(upgradeCost)}
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.buyButtonWrapper}>
              <View style={styles.buttonTexture}>
                <WoodTextureSvg 
                  width={340} 
                  height={60} 
                  variant={canAffordBuy ? "rich" : "dark"} 
                  borderRadius={20} 
                />
              </View>
              <Pressable
                onPress={handleBuy}
                style={styles.buyButton}
                disabled={!canAffordBuy}
              >
                <ThemedText style={styles.buyButtonText}>Buy Another</ThemedText>
                <View style={styles.costBadge}>
                  <CoinIcon size={16} />
                  <ThemedText style={styles.costText}>
                    {formatNumber(cost)}
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Additional Info Card */}
      <View style={styles.infoCard}>
        <ThemedText style={styles.descriptionText}>{building.description}</ThemedText>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Owned</ThemedText>
            <ThemedText style={styles.detailValue}>{building.owned}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Income Each</ThemedText>
            <ThemedText style={styles.detailValue}>
              {formatNumber(incomePerBuilding)}/s
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  buildingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconAndName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  buildingName: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: "#1F2937",
  },
  levelBadge: {
    backgroundColor: "#FBBF24",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  levelText: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: "#78350F",
  },
  statsSection: {
    gap: 12,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
    color: "#6B7280",
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#1F2937",
  },
  incomeValue: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#10B981",
  },
  cardDivider: {
    height: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  actionSection: {
    gap: 12,
  },
  upgradeButtonWrapper: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#8B6914",
    shadowColor: "#8B6914",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  buyButtonWrapper: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#5C330F",
    shadowColor: "#5C330F",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  upgradeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
    zIndex: 1,
  },
  upgradeButtonText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buyButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
    zIndex: 1,
  },
  buyButtonText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  costBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  costText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#FFFFFF",
  },
  lockedNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  lockedText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#6B7280",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  descriptionText: {
    fontFamily: "Nunito",
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  detailLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#1F2937",
  },
});
