import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { Building, DistrictId, formatNumber, getBuildingCost } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { BuildingIcon } from "@/components/BuildingIcon";
import { ShopCard } from "@/components/ShopCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DISTRICT_FILTERS: { id: DistrictId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "forest", label: "Forest" },
  { id: "coastal", label: "Coastal" },
  { id: "mountain", label: "Mountain" },
  { id: "desert", label: "Desert" },
  { id: "skyline", label: "Skyline" },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { state, buyBuilding } = useGame();
  const [selectedFilter, setSelectedFilter] = useState<DistrictId | "all">("all");

  const filteredBuildings = state.buildings.filter(b => {
    if (selectedFilter === "all") return true;
    return b.districtId === selectedFilter;
  });

  const handleBuyBuilding = (buildingId: string) => {
    const success = buyBuilding(buildingId);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderItem = ({ item }: { item: Building }) => {
    const district = state.districts.find(d => d.id === item.districtId);
    const isLocked = !district?.unlocked;
    const cost = getBuildingCost(item);
    const canAfford = state.coins >= cost;

    return (
      <ShopCard
        building={item}
        isLocked={isLocked}
        canAfford={canAfford}
        onBuy={() => handleBuyBuilding(item.id)}
        onPress={() => navigation.navigate("BuildingDetail", { buildingId: item.id })}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <ThemedText style={styles.title}>Building Shop</ThemedText>
        <View style={[styles.coinDisplay, { backgroundColor: theme.cornsilk }]}>
          <CoinIcon size={20} />
          <ThemedText style={styles.coinText}>
            {formatNumber(state.coins)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={DISTRICT_FILTERS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.id;
            const district = state.districts.find(d => d.id === item.id);
            const isLocked = item.id !== "all" && !district?.unlocked;

            return (
              <Pressable
                onPress={() => setSelectedFilter(item.id)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isSelected ? theme.sage : theme.backgroundDefault,
                    opacity: isLocked ? 0.5 : 1,
                  },
                ]}
              >
                {isLocked ? (
                  <Feather name="lock" size={12} color={theme.lockGray} style={{ marginRight: 4 }} />
                ) : null}
                <ThemedText
                  style={[
                    styles.filterText,
                    { color: isSelected ? Colors.light.warmWhite : theme.text },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredBuildings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: Colors.light.darkWood,
  },
  coinDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.card,
  },
  coinText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: Colors.light.gold,
  },
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
  },
});
