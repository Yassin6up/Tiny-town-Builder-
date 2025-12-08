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

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { useMusic } from "@/lib/MusicContext";
import { SettingsSvgIcon } from "@/components/icons/SettingsSvgIcon";
import { formatNumber } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { DistrictBadge } from "@/components/DistrictBadge";
import { StatCard } from "@/components/StatCard";
import { BoostCard } from "@/components/BoostCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { state, activateAdBoost, purchaseGoldenBoost, purchaseAdFree } = useGame();
  const { setMusicVolume } = useMusic();

  // Lower music volume when on stats screen
  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5); // Restore volume when leaving stats
    };
  }, [setMusicVolume]);

  const totalBuildings = state.buildings.reduce((sum, b) => sum + b.owned, 0);
  const unlockedDistricts = state.districts.filter(d => d.unlocked).length;

  const handleAdBoost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    activateAdBoost();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
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
        <View style={styles.mainStats}>
          <View style={[styles.incomeCard, { backgroundColor: theme.sage }]}>
            <CoinIcon size={48} />
            <View style={styles.incomeInfo}>
              <ThemedText style={styles.incomeLabel}>Income per Second</ThemedText>
              <ThemedText style={styles.incomeValue}>
                {formatNumber(state.incomePerSecond)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="dollar-sign"
            label="Total Earned"
            value={formatNumber(state.totalEarned)}
            color={theme.gold}
          />
          <StatCard
            icon="home"
            label="Buildings"
            value={totalBuildings.toString()}
            color={theme.sage}
          />
          <StatCard
            icon="map"
            label="Districts"
            value={`${unlockedDistricts}/5`}
            color={theme.skyBlue}
          />
          <StatCard
            icon="mouse-pointer"
            label="Taps"
            value={formatNumber(state.tapCount)}
            color={theme.sandyBrown}
          />
        </View>

        <ThemedText style={styles.sectionTitle}>Districts</ThemedText>
        <View style={styles.districtBadges}>
          {state.districts.map((district) => (
            <DistrictBadge
              key={district.id}
              district={district}
              isUnlocked={district.unlocked}
            />
          ))}
        </View>

        <ThemedText style={styles.sectionTitle}>Boosts & Upgrades</ThemedText>
        
        {!state.adFreePurchased ? (
          <BoostCard
            title="2x Income Boost"
            description="Watch an ad to double your income for 1 hour"
            buttonText={state.adBoostActive ? "Active!" : "Watch Ad"}
            onPress={handleAdBoost}
            disabled={state.adBoostActive}
            icon="play-circle"
          />
        ) : null}

        {!state.goldenBoostPurchased ? (
          <BoostCard
            title="Golden Boost Pack"
            description="+50% all income permanently"
            buttonText="Purchase"
            onPress={purchaseGoldenBoost}
            icon="star"
            isPremium
          />
        ) : (
          <View style={[styles.purchasedCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="check-circle" size={24} color={theme.sage} />
            <ThemedText style={styles.purchasedText}>Golden Boost Active</ThemedText>
          </View>
        )}

        {!state.adFreePurchased ? (
          <BoostCard
            title="Ad-Free Village"
            description="Remove all ads forever"
            buttonText="Purchase"
            onPress={purchaseAdFree}
            icon="slash"
            isPremium
          />
        ) : (
          <View style={[styles.purchasedCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="check-circle" size={24} color={theme.sage} />
            <ThemedText style={styles.purchasedText}>Ad-Free Active</ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontSize: 28,
    color: "#2D3748",
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderRadius: BorderRadius.full,
    shadowColor: "#4299E1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  mainStats: {
    marginBottom: Spacing.lg,
  },
  incomeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
    backgroundColor: "#48BB78",
    shadowColor: "#48BB78",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeLabel: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  incomeValue: {
    fontFamily: "FredokaOne",
    fontSize: 32,
    color: "#FFFFFF",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: "#2D3748",
    marginBottom: Spacing.md,
  },
  districtBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  purchasedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: "#F0FFF4",
    borderWidth: 2,
    borderColor: "#48BB78",
  },
  purchasedText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 16,
    color: "#2D3748",
  },
});
