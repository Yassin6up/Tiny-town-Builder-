import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { useMusic } from "@/lib/MusicContext";
import { SettingsSvgIcon } from "@/components/icons/SettingsSvgIcon";
import { formatNumber } from "@/lib/gameData";
import { Spacing, BorderRadius } from "@/constants/theme";
import { KidsColors, KidsGradients, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { KidsStatBadge } from "@/components/ui/KidsStatBadge";
import { DistrictId } from "@/lib/gameData";
import { KidsBoostCard } from "@/components/ui/KidsBoostCard";
import { KidsGamePanel } from "@/components/ui/KidsGamePanel";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DISTRICT_COLORS: Record<DistrictId, readonly [string, string]> = {
  forest: ['#66BB6A', '#43A047'],
  coastal: ['#4FC3F7', '#0288D1'],
  mountain: ['#90A4AE', '#546E7A'],
  desert: ['#FFB74D', '#F57C00'],
  skyline: ['#BA68C8', '#7B1FA2'],
};

const DISTRICT_NAMES: Record<DistrictId, string> = {
  forest: 'Forest',
  coastal: 'Coastal',
  mountain: 'Mountain',
  desert: 'Desert',
  skyline: 'Skyline',
};

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { state, activateAdBoost, purchaseGoldenBoost, purchaseAdFree } = useGame();
  const { setMusicVolume } = useMusic();

  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5);
    };
  }, [setMusicVolume]);

  const totalBuildings = state.buildings.reduce((sum, b) => sum + b.owned, 0);
  const unlockedDistricts = state.districts.filter(d => d.unlocked).length;

  const handleAdBoost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    activateAdBoost();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <ThemedText style={styles.title}>Village Stats</ThemedText>
        <Pressable
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <SettingsSvgIcon size={36} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <KidsGamePanel variant="mint" style={styles.incomePanel}>
          <View style={styles.incomeContent}>
            <CoinIcon size={56} />
            <View style={styles.incomeInfo}>
              <ThemedText style={styles.incomeLabel}>Income per Second</ThemedText>
              <ThemedText style={styles.incomeValue}>
                {formatNumber(state.incomePerSecond)}
              </ThemedText>
            </View>
          </View>
        </KidsGamePanel>

        <View style={styles.statsGrid}>
          <KidsStatBadge
            icon="dollar-sign"
            label="Total Earned"
            value={formatNumber(state.totalEarned)}
            color={KidsColors.candyGold}
          />
          <KidsStatBadge
            icon="home"
            label="Buildings"
            value={totalBuildings.toString()}
            color={KidsColors.mintGreen}
          />
          <KidsStatBadge
            icon="map"
            label="Districts"
            value={`${unlockedDistricts}/5`}
            color={KidsColors.skyBlue}
          />
          <KidsStatBadge
            icon="mouse-pointer"
            label="Taps"
            value={formatNumber(state.tapCount)}
            color={KidsColors.bubblegumPink}
          />
        </View>

        <ThemedText style={styles.sectionTitle}>Districts</ThemedText>
        <View style={styles.districtBadges}>
          {state.districts.map((district) => (
            <LinearGradient
              key={district.id}
              colors={DISTRICT_COLORS[district.id as DistrictId]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.miniBadge,
                !district.unlocked && styles.miniBadgeLocked,
              ]}
            >
              {!district.unlocked && (
                <Feather name="lock" size={12} color="rgba(255,255,255,0.8)" style={styles.lockIcon} />
              )}
              <ThemedText style={styles.miniBadgeText}>
                {DISTRICT_NAMES[district.id as DistrictId]}
              </ThemedText>
            </LinearGradient>
          ))}
        </View>

        <ThemedText style={styles.sectionTitle}>Boosts & Upgrades</ThemedText>
        
        {!state.adFreePurchased ? (
          <KidsBoostCard
            title="2x Income Boost"
            description="Watch an ad to double your income for 1 hour"
            buttonText={state.adBoostActive ? "Active!" : "Watch Ad"}
            onPress={handleAdBoost}
            disabled={state.adBoostActive}
            icon="play-circle"
          />
        ) : null}

        {!state.goldenBoostPurchased ? (
          <KidsBoostCard
            title="Golden Boost Pack"
            description="+50% all income permanently"
            buttonText="Purchase"
            onPress={purchaseGoldenBoost}
            icon="star"
            isPremium
          />
        ) : (
          <KidsGamePanel variant="mint" style={styles.purchasedCard}>
            <View style={styles.purchasedContent}>
              <View style={styles.purchasedIconWrapper}>
                <Feather name="check-circle" size={28} color="#FFFFFF" />
              </View>
              <ThemedText style={styles.purchasedText}>Golden Boost Active</ThemedText>
            </View>
          </KidsGamePanel>
        )}

        {!state.adFreePurchased ? (
          <KidsBoostCard
            title="Ad-Free Village"
            description="Remove all ads forever"
            buttonText="Purchase"
            onPress={purchaseAdFree}
            icon="slash"
            isPremium
          />
        ) : (
          <KidsGamePanel variant="mint" style={styles.purchasedCard}>
            <View style={styles.purchasedContent}>
              <View style={styles.purchasedIconWrapper}>
                <Feather name="check-circle" size={28} color="#FFFFFF" />
              </View>
              <ThemedText style={styles.purchasedText}>Ad-Free Active</ThemedText>
            </View>
          </KidsGamePanel>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: "FredokaOne",
    fontSize: 32,
    color: "#2D3748",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  settingsButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: KidsRadius.round,
    borderWidth: 3,
    borderColor: KidsColors.skyBlue,
    ...KidsShadows.soft,
  },
  content: {
    flex: 1,
  },
  incomePanel: {
    marginBottom: Spacing.lg,
  },
  incomeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeLabel: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  incomeValue: {
    fontFamily: "FredokaOne",
    fontSize: 36,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: "FredokaOne",
    fontSize: 24,
    color: "#2D3748",
    marginBottom: Spacing.md,
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  districtBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  purchasedCard: {
    marginBottom: Spacing.md,
  },
  purchasedContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  purchasedIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: KidsRadius.round,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  purchasedText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
  },
  miniBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: KidsRadius.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    ...KidsShadows.soft,
  },
  miniBadgeLocked: {
    opacity: 0.6,
  },
  miniBadgeText: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lockIcon: {
    marginRight: 4,
  },
});
