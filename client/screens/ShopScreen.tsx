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
import { useMusic } from "@/lib/MusicContext";
import { Building, DistrictId, formatNumber, getBuildingCost } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { BuildingIcon } from "@/components/BuildingIcon";
import { KidsShopCard } from "@/components/ui/KidsShopCard";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { TinyTownColors, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
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
  const { setMusicVolume } = useMusic();
  const [selectedFilter, setSelectedFilter] = useState<DistrictId | "all">("all");

  // Lower music volume when on shop screen
  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5); // Restore volume when leaving shop
    };
  }, [setMusicVolume]);

  const filteredBuildings = state.buildings.filter(b => {
    if (selectedFilter === "all") return true;
    return b.districtId === selectedFilter;
  });

  const handleBuyBuilding = async (buildingId: string) => {
    
    const success = buyBuilding(buildingId);
    if (success) {
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
      <KidsShopCard
        building={item}
        isLocked={isLocked}
        canAfford={canAfford}
        onBuy={() => handleBuyBuilding(item.id)}
        onPress={() => navigation.navigate("BuildingDetail", { buildingId: item.id })}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: TinyTownColors.background.warmCream }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <ThemedText style={styles.title}>🏪 Building Shop</ThemedText>
        <View style={styles.coinDisplay}>
          <View style={styles.coinDisplayInner}>
            <CoinIcon size={36} />
            <ThemedText style={styles.coinText}>
              {formatNumber(state.coins)}
            </ThemedText>
          </View>
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

            const filterColors = isSelected 
              ? ([TinyTownColors.success.light, TinyTownColors.success.main] as const)
              : ([TinyTownColors.panel.white, '#F5F5F5'] as const);
            const textColor = isSelected ? '#FFFFFF' : TinyTownColors.text.primary;

            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedFilter(item.id)}
                style={[styles.filterButtonWrapper, { opacity: isLocked ? 0.6 : 1 }]}
              >
                <LinearGradient
                  colors={filterColors}
                  style={styles.filterGradient}
                >
                  <View style={styles.filterShine} />
                  {isLocked ? (
                    <Feather name="lock" size={12} color={textColor} style={{ marginRight: 4 }} />
                  ) : null}
                  <ThemedText
                    style={[
                      styles.filterText,
                      { color: textColor },
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                </LinearGradient>
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
    fontSize: 32,
    color: TinyTownColors.text.primary,
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  coinDisplay: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  coinDisplayInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: "#FFE066",
  },
  coinText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: TinyTownColors.primary.main,
  },
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterButtonWrapper: {
    borderRadius: KidsRadius.round,
    overflow: "hidden",
    ...KidsShadows.soft,
  },
  filterGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md + 8,
    paddingVertical: Spacing.sm + 4,
    borderRadius: KidsRadius.round,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    position: "relative",
    overflow: "hidden",
  },
  filterShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderTopLeftRadius: KidsRadius.round,
    borderTopRightRadius: KidsRadius.round,
  },
  filterText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },
});
