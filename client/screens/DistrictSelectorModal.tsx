import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { useMusic } from "@/lib/MusicContext";
import { formatNumber, DistrictId } from "@/lib/gameData";
import { Spacing, BorderRadius } from "@/constants/theme";
import { KidsColors, KidsGradients, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
import { CoinIcon } from "@/components/CoinIcon";
import { KidsDistrictCard } from "@/components/ui/KidsDistrictCard";
import { KidsGameButton } from "@/components/ui/KidsGameButton";

const DISTRICT_COLORS: Record<DistrictId, readonly [string, string]> = {
  forest: ['#66BB6A', '#43A047'],
  coastal: ['#4FC3F7', '#0288D1'],
  mountain: ['#90A4AE', '#546E7A'],
  desert: ['#FFB74D', '#F57C00'],
  skyline: ['#BA68C8', '#7B1FA2'],
};

const DISTRICT_LOGOS: Record<DistrictId, any> = {
  forest: require("../../assets/images/districtLogo/forest.png"),
  coastal: require("../../assets/images/districtLogo/coastal.png"),
  mountain: require("../../assets/images/districtLogo/mountain.png"),
  desert: require("../../assets/images/districtLogo/dissert.png"),
  skyline: require("../../assets/images/districtLogo/city.png"),
};

export default function DistrictSelectorModal() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { state, setCurrentDistrict, unlockDistrict } = useGame();
  const { setMusicVolume } = useMusic();

  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5);
    };
  }, [setMusicVolume]);

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
      style={styles.container}
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
        const colors = DISTRICT_COLORS[district.id];

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
              styles.districtCardWrapper,
              isSelected && styles.selectedCard,
              { opacity: district.unlocked || canAfford ? 1 : 0.7 },
            ]}
          >
            <LinearGradient
              colors={colors}
              style={styles.districtCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardShine} />
              
              <View style={styles.logoContainer}>
                <Image 
                  source={DISTRICT_LOGOS[district.id]}
                  style={styles.districtLogo}
                  resizeMode="contain"
                />
                {!district.unlocked && (
                  <View style={styles.lockOverlay}>
                    <Feather name="lock" size={32} color="#FFFFFF" />
                  </View>
                )}
                {district.unlocked && isSelected && (
                  <View style={styles.checkBadge}>
                    <Feather name="check" size={20} color="#FFFFFF" />
                  </View>
                )}
              </View>

              <View style={styles.districtInfo}>
                <ThemedText style={styles.districtName}>{district.name}</ThemedText>
                <ThemedText style={styles.districtDescription}>
                  {district.description}
                </ThemedText>
                <View style={styles.bonusRow}>
                  <View style={styles.bonusBadge}>
                    <Feather name="trending-up" size={14} color="#FFFFFF" />
                    <ThemedText style={styles.bonusText}>
                      {district.incomeMultiplier}x income
                    </ThemedText>
                  </View>
                </View>
              </View>

              {!district.unlocked && (
                <View style={styles.unlockSection}>
                  <View style={styles.costRow}>
                    <CoinIcon size={18} />
                    <ThemedText style={styles.costText}>
                      {formatNumber(district.unlockCost)}
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.unlockButton,
                    { backgroundColor: canAfford ? KidsColors.mintGreen : "#9E9E9E" }
                  ]}>
                    <ThemedText style={styles.unlockButtonText}>
                      {canAfford ? "Unlock" : "Need more"}
                    </ThemedText>
                  </View>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4FD",
  },
  subtitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#718096",
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  districtCardWrapper: {
    borderRadius: KidsRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.md,
    borderWidth: 4,
    borderColor: "transparent",
    ...KidsShadows.medium,
  },
  selectedCard: {
    borderColor: KidsColors.candyGold,
    borderWidth: 4,
  },
  districtCard: {
    flexDirection: "row",
    padding: Spacing.md,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  cardShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: KidsRadius.md,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  districtLogo: {
    width: "90%",
    height: "90%",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: KidsColors.mintGreen,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  districtInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  districtName: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  districtDescription: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 2,
  },
  bonusRow: {
    flexDirection: "row",
    marginTop: Spacing.xs,
  },
  bonusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: KidsRadius.round,
  },
  bonusText: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  unlockSection: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  costText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  unlockButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: KidsRadius.round,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  unlockButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
});
