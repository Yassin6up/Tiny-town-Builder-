import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { formatNumber, DistrictId } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { CoinIcon } from "@/components/CoinIcon";

const DISTRICT_COLORS: Record<DistrictId, string> = {
  forest: "#8FBC8F",
  coastal: "#87CEEB",
  mountain: "#B8B8D1",
  desert: "#F4A460",
  skyline: "#A9A9C9",
};

export default function DistrictSelectorModal() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { state, setCurrentDistrict, unlockDistrict } = useGame();

  const handleSelectDistrict = (districtId: DistrictId) => {
    const district = state.districts.find(d => d.id === districtId);
    if (district?.unlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentDistrict(districtId);
      navigation.goBack();
    }
  };

  const handleUnlockDistrict = (districtId: DistrictId) => {
    const success = unlockDistrict(districtId);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      <ThemedText style={styles.subtitle}>
        Select a district to build in
      </ThemedText>

      {state.districts.map((district) => {
        const isSelected = state.currentDistrict === district.id;
        const canAfford = state.coins >= district.unlockCost;

        return (
          <Pressable
            key={district.id}
            onPress={() =>
              district.unlocked
                ? handleSelectDistrict(district.id)
                : canAfford
                  ? handleUnlockDistrict(district.id)
                  : null
            }
            style={[
              styles.districtCard,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: isSelected ? theme.sage : "transparent",
                borderWidth: isSelected ? 2 : 0,
                opacity: district.unlocked || canAfford ? 1 : 0.6,
              },
            ]}
          >
            <View
              style={[
                styles.districtPreview,
                { backgroundColor: DISTRICT_COLORS[district.id] },
              ]}
            >
              {!district.unlocked ? (
                <Feather name="lock" size={24} color={Colors.light.warmWhite} />
              ) : isSelected ? (
                <Feather name="check" size={24} color={Colors.light.warmWhite} />
              ) : null}
            </View>

            <View style={styles.districtInfo}>
              <ThemedText style={styles.districtName}>{district.name}</ThemedText>
              <ThemedText style={styles.districtDescription}>
                {district.description}
              </ThemedText>
              <View style={styles.bonusRow}>
                <Feather name="trending-up" size={14} color={theme.sage} />
                <ThemedText style={styles.bonusText}>
                  {district.incomeMultiplier}x income
                </ThemedText>
              </View>
            </View>

            {!district.unlocked ? (
              <View style={styles.unlockSection}>
                <View style={styles.costRow}>
                  <CoinIcon size={16} />
                  <ThemedText style={styles.costText}>
                    {formatNumber(district.unlockCost)}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => canAfford ? handleUnlockDistrict(district.id) : null}
                  style={[
                    styles.unlockButton,
                    {
                      backgroundColor: canAfford ? theme.sage : theme.lockGray,
                    },
                  ]}
                >
                  <ThemedText style={styles.unlockButtonText}>
                    {canAfford ? "Unlock" : "Need more"}
                  </ThemedText>
                </Pressable>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
    opacity: 0.7,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  districtCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  districtPreview: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  districtInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  districtName: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: Colors.light.darkWood,
  },
  districtDescription: {
    fontFamily: "Nunito",
    fontSize: 13,
    color: Colors.light.darkWood,
    opacity: 0.7,
    marginTop: 2,
  },
  bonusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  bonusText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
    color: Colors.light.sage,
  },
  unlockSection: {
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
    color: Colors.light.gold,
  },
  unlockButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  unlockButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 12,
    color: Colors.light.warmWhite,
  },
});
