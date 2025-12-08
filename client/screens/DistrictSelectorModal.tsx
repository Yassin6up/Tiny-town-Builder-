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

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { useMusic } from "@/lib/MusicContext";
import { formatNumber, DistrictId } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { CoinIcon } from "@/components/CoinIcon";
import { WoodTextureSvg, StoneTextureSvg } from "@/components/textures";

const DISTRICT_COLORS: Record<DistrictId, string> = {
  forest: "#8FBC8F",
  coastal: "#87CEEB",
  mountain: "#B8B8D1",
  desert: "#F4A460",
  skyline: "#A9A9C9",
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

  // Lower music volume when modal opens
  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5); // Restore volume when modal closes
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
          <View key={district.id} style={styles.districtCardWrapper}>
            <View style={styles.cardTexture}>
              <WoodTextureSvg 
                width={340} 
                height={180} 
                variant={district.unlocked ? "light" : "dark"} 
                borderRadius={20} 
              />
            </View>
            <Pressable
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
                  borderColor: isSelected ? "#FFD700" : "transparent",
                  borderWidth: isSelected ? 3 : 0,
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
                <View style={styles.checkOverlay}>
                  <Feather name="check-circle" size={32} color="#00E676" />
                </View>
              )}
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
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  subtitle: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: "#718096",
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  districtCardWrapper: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: "#5C330F",
    shadowColor: "#5C330F",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  districtCard: {
    flexDirection: "row",
    padding: Spacing.md + 2,
    position: "relative",
    zIndex: 1,
  },
  districtPreview: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  districtLogo: {
    width: "100%",
    height: "100%",
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
  checkOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  districtInfo: {
    flex: 1,
    marginLeft: Spacing.md + 2,
    justifyContent: "center",
  },
  districtName: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  districtDescription: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  bonusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs + 2,
  },
  bonusText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
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
    fontSize: 15,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  unlockButton: {
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    shadowColor: "#48BB78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
});
