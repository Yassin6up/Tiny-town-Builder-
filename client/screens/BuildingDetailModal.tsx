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
import { formatNumber, getBuildingCost, getUpgradeCost } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { BuildingIcon } from "@/components/BuildingIcon";

type RouteParams = RouteProp<RootStackParamList, "BuildingDetail">;

export default function BuildingDetailModal() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const { theme } = useTheme();
  const { state, buyBuilding, upgradeBuilding } = useGame();

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
  const canAffordBuy = state.coins >= cost;
  const canAffordUpgrade = state.coins >= upgradeCost && building.owned > 0;
  const isLocked = !district?.unlocked;

  const incomePerBuilding = building.baseIncome * (district?.incomeMultiplier ?? 1) * (1 + (building.level - 1) * 0.5);
  const totalIncome = incomePerBuilding * building.owned;

  const handleBuy = () => {
    if (isLocked || !canAffordBuy) return;
    const success = buyBuilding(building.id);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleUpgrade = () => {
    if (!canAffordUpgrade) return;
    const success = upgradeBuilding(building.id);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.backgroundDefault }]}>
          <BuildingIcon type={building.iconType} size={100} />
        </View>
        <ThemedText style={styles.buildingName}>{building.name}</ThemedText>
        <ThemedText style={styles.buildingDescription}>{building.description}</ThemedText>
        
        <View style={styles.levelBadge}>
          {Array.from({ length: building.level }).map((_, i) => (
            <Feather key={i} name="star" size={16} color={theme.gold} />
          ))}
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Owned</ThemedText>
          <ThemedText style={styles.statValue}>{building.owned}</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Level</ThemedText>
          <ThemedText style={styles.statValue}>{building.level}</ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Income Each</ThemedText>
          <View style={styles.incomeRow}>
            <CoinIcon size={16} />
            <ThemedText style={styles.incomeValue}>
              {formatNumber(incomePerBuilding)}/sec
            </ThemedText>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Total Income</ThemedText>
          <View style={styles.incomeRow}>
            <CoinIcon size={16} />
            <ThemedText style={styles.incomeValue}>
              {formatNumber(totalIncome)}/sec
            </ThemedText>
          </View>
        </View>
      </View>

      {isLocked ? (
        <View style={[styles.lockedNotice, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="lock" size={20} color={theme.lockGray} />
          <ThemedText style={styles.lockedText}>
            Unlock {district?.name} district first
          </ThemedText>
        </View>
      ) : (
        <>
          <Pressable
            onPress={handleBuy}
            style={[
              styles.actionButton,
              {
                backgroundColor: canAffordBuy ? theme.sage : theme.lockGray,
              },
            ]}
          >
            <View style={styles.buttonContent}>
              <ThemedText style={styles.buttonLabel}>Buy Another</ThemedText>
              <View style={styles.costRow}>
                <CoinIcon size={18} />
                <ThemedText style={styles.buttonCost}>{formatNumber(cost)}</ThemedText>
              </View>
            </View>
          </Pressable>

          {building.owned > 0 ? (
            <Pressable
              onPress={handleUpgrade}
              style={[
                styles.actionButton,
                styles.upgradeButton,
                {
                  backgroundColor: canAffordUpgrade ? theme.sandyBrown : theme.lockGray,
                },
              ]}
            >
              <View style={styles.buttonContent}>
                <ThemedText style={styles.buttonLabel}>
                  Upgrade to Level {building.level + 1}
                </ThemedText>
                <View style={styles.costRow}>
                  <CoinIcon size={18} />
                  <ThemedText style={styles.buttonCost}>
                    {formatNumber(upgradeCost)}
                  </ThemedText>
                </View>
              </View>
            </Pressable>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  buildingName: {
    fontFamily: "FredokaOne",
    fontSize: 28,
    color: Colors.light.darkWood,
    marginBottom: Spacing.xs,
  },
  buildingDescription: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
    opacity: 0.7,
    textAlign: "center",
  },
  levelBadge: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  statsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  statLabel: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
    opacity: 0.7,
  },
  statValue: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: Colors.light.darkWood,
  },
  statDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  incomeValue: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: Colors.light.gold,
  },
  lockedNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  lockedText: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.lockGray,
  },
  actionButton: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.button,
  },
  upgradeButton: {
    marginTop: Spacing.sm,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.light.warmWhite,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  buttonCost: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: Colors.light.warmWhite,
  },
});
