import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Pressable, Text } from "react-native";
import { DistrictId, formatNumber } from "@/lib/gameData";
import { useGame } from "@/lib/GameContext";
import { IsometricBuilding } from "./IsometricBuilding";
import { BuildingIcon } from "./BuildingIcon";
import { CoinIcon } from "./CoinIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ParticleEffect } from "./ParticleEffect";
import { WoodTextureSvg } from "./textures";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface IsometricBuildingGridProps {
  districtId: DistrictId;
  onCoinCollect?: (x: number, y: number, amount: number) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Grid layout configuration for isometric view
const GRID_SIZE = 8; // 8x8 grid
const BUILDINGS_PER_ROW = 2;

export function IsometricBuildingGrid({ districtId, onCoinCollect }: IsometricBuildingGridProps) {
  const { state, collectBuildingCoins } = useGame();
  const navigation = useNavigation<NavigationProp>();
  const [collectingBuildings, setCollectingBuildings] = useState<Set<string>>(new Set());

  // Filter buildings for current district
  const districtBuildings = state.buildings.filter(
    (b) => b.districtId === districtId && b.owned > 0
  );

  // Check if district is unlocked
  const district = state.districts.find((d) => d.id === districtId);
  const isUnlocked = district?.unlocked ?? false;

  // Calculate income per building
  const getBuildingIncome = (building: any) => {
    const incomePerBuilding = building.baseIncome * (district?.incomeMultiplier ?? 1) * (1 + (building.level - 1) * 0.5);
    return Math.floor(incomePerBuilding * building.owned);
  };

  // Arrange buildings in a simple grid pattern
  const gridPositions = districtBuildings.map((building, index) => {
    return {
      building,
    };
  });

  const handleBuildingPress = (buildingId: string) => {
    navigation.navigate("BuildingDetail", { buildingId });
  };

  return (
    <View style={styles.container}>
      {/* Ambient particles based on district */}
      <View style={styles.ambientParticles}>
        {districtId === "forest" && (
          <>
            <View style={[styles.particleZone, { left: "10%", top: "20%" }]}>
              <ParticleEffect type="leaves" count={3} />
            </View>
            <View style={[styles.particleZone, { right: "15%", top: "40%" }]}>
              <ParticleEffect type="leaves" count={2} />
            </View>
          </>
        )}
        {districtId === "coastal" && (
          <View style={[styles.particleZone, { left: "50%", top: "10%" }]}>
            <ParticleEffect type="sparkles" count={4} />
          </View>
        )}
        {districtId === "mountain" && (
          <View style={[styles.particleZone, { right: "20%", top: "15%" }]}>
            <ParticleEffect type="stars" count={5} />
          </View>
        )}
        {districtId === "skyline" && (
          <View style={[styles.particleZone, { left: "30%", top: "25%" }]}>
            <ParticleEffect type="sparkles" count={3} />
          </View>
        )}
      </View>

      {/* Simple 2x2 grid with buildings */}
      <View style={styles.gridContainer}>
        {gridPositions.length === 0 ? (
          <View style={styles.emptyState}>
            {/* Empty state - no buildings yet */}
          </View>
        ) : (
          <View style={styles.gridRows}>
            {gridPositions.map(({ building }, index) => {
              const income = getBuildingIncome(building);
              const accumulatedCoins = Math.floor(building.accumulatedCoins);
              const isCollecting = collectingBuildings.has(building.id);
              
              return (
                <View
                  key={building.id}
                  style={styles.gridCell}
                >
                  <View style={styles.buildingCardWrapper}>
                    <View style={styles.cardTextureLayer}>
                      <WoodTextureSvg width={190} height={360} variant="light" borderRadius={16} />
                    </View>
                    <Pressable 
                      onLongPress={() => handleBuildingPress(building.id)}
                      style={styles.buildingCard}
                    >
                      {/* Top Section - Name and Level Badge */}
                      <View style={styles.cardTop}>
                        <Text style={styles.buildingName}>{building.name}</Text>
                        {building.level > 1 && (
                          <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>LV {building.level}</Text>
                          </View>
                        )}
                      </View>

                      {/* Center Section - Large Building Image */}
                      <Pressable 
                        style={styles.buildingImageContainer}
                        onPress={() => handleBuildingPress(building.id)}
                      >
                        <BuildingIcon type={building.iconType} size={70} />
                      </Pressable>

                      {/* Stats Section */}
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <CoinIcon size={18} />
                          <Text style={styles.statText}>{formatNumber(accumulatedCoins)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <CoinIcon size={14} />
                          <Text style={styles.incomePerSecText}>+{formatNumber(income)}/s</Text>
                        </View>
                      </View>

                      {/* Collect Button - Main CTA */}
                      {accumulatedCoins > 0 && (
                        <View style={styles.collectButtonWrapper}>
                          <View style={styles.collectButtonTexture}>
                            <WoodTextureSvg width={160} height={50} variant="rich" borderRadius={15} />
                          </View>
                          <Pressable
                            style={styles.collectButton}
                            onPress={async () => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                              setCollectingBuildings(prev => new Set(prev).add(building.id));
                              const collected = collectBuildingCoins(building.id);
                              
                              // Play cash sound
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
                              
                              setTimeout(() => {
                                setCollectingBuildings(prev => {
                                  const next = new Set(prev);
                                  next.delete(building.id);
                                  return next;
                                });
                              }, 800);
                            }}
                          >
                            <Text style={styles.collectButtonText}>COLLECT</Text>
                            <View style={styles.collectButtonBadge}>
                              <CoinIcon size={18} />
                              <Text style={styles.collectButtonCost}>{formatNumber(accumulatedCoins)}</Text>
                            </View>
                          </Pressable>
                        </View>
                      )}



                      {/* Owned Badge - Small indicator in corner */}
                      {building.owned > 1 && (
                        <View style={styles.ownedCornerBadge}>
                          <Text style={styles.ownedCornerText}>×{building.owned}</Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    minHeight: 600,
    overflow: "visible",
  },
  ambientParticles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  particleZone: {
    position: "absolute",
    width: 100,
    height: 100,
  },
  gridContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: "100%",
  },
  gridRows: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    paddingHorizontal: 4,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCell: {
    width: "49.5%",
  },
  buildingCardWrapper: {
    position: "relative",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  cardTextureLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  buildingCard: {
    position: "relative",
    zIndex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },
  cardTop: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  buildingName: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#8B4513",
  },
  levelBadge: {
    backgroundColor: "#00B8FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#0099CC",
    borderBottomColor: "#006699",
    borderBottomWidth: 4,
    shadowColor: "#006699",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  levelText: {
    fontFamily: "FredokaOne",
    fontSize: 11,
    color: "#FFFFFF",
  },
  buildingImageContainer: {
    width: "100%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#FFE082",
    borderBottomColor: "#FFD700",
    borderBottomWidth: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  statsSection: {
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 6,
    width: "100%",
    marginBottom: 8,
    justifyContent: "space-around",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#6B7280",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFD700",
    borderBottomColor: "#FFA000",
    borderBottomWidth: 3,
    shadowColor: "#FFA000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValueText: {
    fontFamily: "FredokaOne",
    fontSize: 15,
    color: "#1F2937",
  },
  statText: {
    fontFamily: "FredokaOne",
    fontSize: 12,
    color: "#FF9800",
  },
  incomePerSecText: {
    fontFamily: "FredokaOne",
    fontSize: 11,
    color: "#10B981",
  },
  incomeText: {
    fontFamily: "FredokaOne",
    fontSize: 15,
    color: "#10B981",
  },
  collectButtonWrapper: {
    width: "100%",
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#5C330F",
    shadowColor: "#5C330F",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  collectButtonTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  collectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: "relative",
    zIndex: 1,
  },
  collectButtonText: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  collectButtonBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  collectButtonCost: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#FFFFFF",
  },
  upgradeButtonSmall: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F97316",
    borderWidth: 3,
    borderColor: "#EA580C",
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ownedBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ownedText: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: "#FFFFFF",
  },
  ownedCornerBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  ownedCornerText: {
    fontFamily: "FredokaOne",
    fontSize: 10,
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
});
