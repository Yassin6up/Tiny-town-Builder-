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
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { useMusic } from "@/lib/MusicContext";
import { formatNumber, getBuildingCost, getUpgradeCost } from "@/lib/gameData";
import { Spacing, BorderRadius } from "@/constants/theme";
import { KidsColors, KidsGradients, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { DiamondIcon } from "@/components/DiamondIcon";
import { BuildingIcon } from "@/components/BuildingIcon";
import { Audio } from "expo-av";
import { KidsGamePanel } from "@/components/ui/KidsGamePanel";
import { KidsGameButton } from "@/components/ui/KidsGameButton";

const MAX_LEVEL = 5;

type RouteParams = RouteProp<RootStackParamList, "BuildingDetail">;

export default function BuildingDetailModal() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const { theme } = useTheme();
  const { state, buyBuilding, upgradeBuilding } = useGame();
  const { setMusicVolume } = useMusic();

  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5);
    };
  }, [setMusicVolume]);

  const building = state.buildings.find(b => b.id === route.params.buildingId);
  const district = state.districts.find(d => d.id === building?.districtId);

  if (!building) {
    return (
      <View style={styles.container}>
        <ThemedText>Building not found</ThemedText>
      </View>
    );
  }

  const cost = getBuildingCost(building);
  const upgradeCost = getUpgradeCost(building);
  
  const diamondCostForBuilding = building.diamondCost ?? 0;
  const diamondCostForUpgrade = (building.level === 4) ? 3 : 0;
  
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

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < MAX_LEVEL; i++) {
      stars.push(
        <Feather 
          key={i} 
          name="star" 
          size={20} 
          color={i < building.level ? KidsColors.candyGold : "#E0E0E0"} 
          style={{ marginHorizontal: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <KidsGamePanel variant="white" style={styles.buildingCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <BuildingIcon type={building.iconType} size={56} />
          </View>
          <View style={styles.headerInfo}>
            <ThemedText style={styles.buildingName}>{building.name}</ThemedText>
            <View style={styles.starsRow}>
              {renderStars()}
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Total Earnings:</ThemedText>
            <View style={styles.statValueRow}>
              <CoinIcon size={20} />
              <ThemedText style={styles.statValue}>
                {formatNumber(totalIncome * 3600)}/hr
              </ThemedText>
            </View>
          </View>

          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Income:</ThemedText>
            <View style={styles.statValueRow}>
              <CoinIcon size={20} />
              <ThemedText style={styles.incomeValue}>
                +{formatNumber(totalIncome)}/s
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {isLocked ? (
          <KidsGamePanel variant="cream" style={styles.lockedNotice}>
            <View style={styles.lockedContent}>
              <Feather name="lock" size={24} color={KidsColors.lavenderPurple} />
              <ThemedText style={styles.lockedText}>
                Unlock {district?.name} district first
              </ThemedText>
            </View>
          </KidsGamePanel>
        ) : (
          <View style={styles.actionSection}>
            <KidsGameButton
              variant={canAffordUpgrade ? "gold" : "gray"}
              size="large"
              onPress={handleUpgrade}
              disabled={!canAffordUpgrade || isMaxLevel}
            >
              <View style={styles.buttonContent}>
                <ThemedText style={styles.buttonText}>
                  {isMaxLevel ? "Max Level" : "Upgrade"}
                </ThemedText>
                {!isMaxLevel && (
                  <View style={styles.costBadge}>
                    <CoinIcon size={18} />
                    <ThemedText style={styles.costText}>
                      {formatNumber(upgradeCost)}
                    </ThemedText>
                  </View>
                )}
              </View>
            </KidsGameButton>

            <KidsGameButton
              variant={canAffordBuy ? "green" : "gray"}
              size="large"
              onPress={handleBuy}
              disabled={!canAffordBuy}
            >
              <View style={styles.buttonContent}>
                <ThemedText style={styles.buttonText}>Buy Another</ThemedText>
                <View style={styles.costBadge}>
                  <CoinIcon size={18} />
                  <ThemedText style={styles.costText}>
                    {formatNumber(cost)}
                  </ThemedText>
                </View>
              </View>
            </KidsGameButton>
          </View>
        )}
      </KidsGamePanel>

      <KidsGamePanel variant="blue" style={styles.infoCard}>
        <ThemedText style={styles.descriptionText}>{building.description}</ThemedText>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Owned</ThemedText>
            <ThemedText style={styles.detailValue}>{building.owned}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Each</ThemedText>
            <ThemedText style={styles.detailValue}>
              {formatNumber(incomePerBuilding)}/s
            </ThemedText>
          </View>
        </View>
      </KidsGamePanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4FD",
  },
  buildingCard: {
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: KidsRadius.lg,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: KidsColors.skyBlue,
    ...KidsShadows.soft,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  buildingName: {
    fontFamily: "FredokaOne",
    fontSize: 24,
    color: "#2D3748",
  },
  starsRow: {
    flexDirection: "row",
    marginTop: Spacing.xs,
  },
  statsSection: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#718096",
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statValue: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: "#2D3748",
  },
  incomeValue: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: KidsColors.mintGreen,
  },
  cardDivider: {
    height: 3,
    backgroundColor: "#E8F4FD",
    marginVertical: Spacing.md,
    borderRadius: 2,
  },
  actionSection: {
    gap: Spacing.md,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
  },
  costBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: KidsRadius.round,
  },
  costText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#FFFFFF",
  },
  lockedNotice: {
    marginTop: Spacing.sm,
  },
  lockedContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  lockedText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#718096",
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  descriptionText: {
    fontFamily: "Nunito",
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  detailItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: Spacing.md,
    borderRadius: KidsRadius.md,
  },
  detailLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
