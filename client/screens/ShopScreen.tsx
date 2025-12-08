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
import { ShopCard } from "@/components/ShopCard";
import { Audio } from "expo-av";
import { WoodTextureSvg } from "@/components/textures";
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
    <View style={[styles.container, { backgroundColor: "#E8F4FD" }]}>
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

            return (
              <View style={styles.filterButtonWrapper}>
                <View style={styles.filterButtonTexture}>
                  <WoodTextureSvg 
                    width={100} 
                    height={40} 
                    variant={isSelected ? "rich" : "light"} 
                    borderRadius={20} 
                  />
                </View>
                <Pressable
                  onPress={() => setSelectedFilter(item.id)}
                  style={[styles.filterButton, { opacity: isLocked ? 0.6 : 1 }]}
                >
                {isLocked ? (
                  <Feather name="lock" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                ) : null}
                <ThemedText
                  style={[
                    styles.filterText,
                    { 
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0, 0, 0, 0.5)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    },
                  ]}
                >
                  {item.label}
                </ThemedText>
                </Pressable>
              </View>
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
    fontSize: 34,
    color: "#2D3748",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
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
    color: "#FFB74D",
  },
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterButtonWrapper: {
    position: "relative",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  filterButtonTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  filterButton: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md + 8,
    paddingVertical: Spacing.sm + 6,
    borderRadius: 20,
  },
  filterText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },
});
