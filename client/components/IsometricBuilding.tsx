import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Building } from "@/lib/gameData";
import { BuildingIcon } from "./BuildingIcon";
import { ThemedText } from "./ThemedText";
import { Colors, Spacing } from "@/constants/theme";

interface IsometricBuildingProps {
  building: Building;
  gridX: number;
  gridY: number;
  onPress: () => void;
  isUnlocked: boolean;
}

const ISOMETRIC_ANGLE = 30; // degrees
const TILE_WIDTH = 120;
const TILE_HEIGHT = 60;
const BUILDINGS_PER_ROW = 2; // Must match IsometricBuildingGrid

export function IsometricBuilding({
  building,
  gridX,
  gridY,
  onPress,
  isUnlocked,
}: IsometricBuildingProps) {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);
  const bobbing = useSharedValue(0);
  const smokeOpacity = useSharedValue(0);

  // Calculate isometric position - center the entire grid
  const isoX = (gridX - gridY) * (TILE_WIDTH / 2);
  const isoY = (gridX + gridY) * (TILE_HEIGHT / 2);

  useEffect(() => {
    // Idle animation - subtle bobbing for active buildings
    if (building.owned > 0) {
      bobbing.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Smoke/particle effect for producing buildings
      smokeOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [building.owned]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Press animation
    scale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );

    onPress();
  };

  const buildingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bobbing.value + elevation.value },
      { scale: scale.value },
    ],
  }));

  const smokeStyle = useAnimatedStyle(() => ({
    opacity: smokeOpacity.value,
  }));

  if (building.owned === 0) {
    return null; // Don't render buildings that aren't owned
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: isoX,
          top: isoY,
        },
      ]}
    >
      <Pressable onPress={handlePress} disabled={!isUnlocked}>
        <Animated.View style={[styles.buildingWrapper, buildingStyle]}>
          {/* Smoke/Production effect */}
          {building.owned > 0 && (
            <Animated.View style={[styles.smoke, smokeStyle]}>
              <View style={styles.smokeParticle} />
            </Animated.View>
          )}

          {/* Building Shadow */}
          <View style={styles.shadow} />

          {/* Building Base (Isometric platform) */}
          <View style={[styles.base, { opacity: isUnlocked ? 1 : 0.5 }]}>
            <View style={styles.baseTop} />
            <View style={styles.baseSide} />
          </View>

          {/* Building Icon/Model */}
          <View style={styles.buildingContent}>
            <BuildingIcon type={building.iconType} size={100} />
            
            {/* Level indicator */}
            {building.level > 1 && (
              <View style={styles.levelBadge}>
                <ThemedText style={styles.levelText}>Lv.{building.level}</ThemedText>
              </View>
            )}

            {/* Count indicator for multiple buildings */}
            {building.owned > 1 && (
              <View style={styles.countBadge}>
                <ThemedText style={styles.countText}>x{building.owned}</ThemedText>
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: TILE_WIDTH,
    height: TILE_WIDTH * 1.5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buildingWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  shadow: {
    position: "absolute",
    bottom: -5,
    width: TILE_WIDTH * 0.8,
    height: TILE_HEIGHT * 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: TILE_WIDTH,
    transform: [{ scaleY: 0.5 }],
  },
  base: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    position: "relative",
    marginBottom: -10,
  },
  baseTop: {
    position: "absolute",
    top: 0,
    width: TILE_WIDTH,
    height: TILE_HEIGHT / 2,
    backgroundColor: "#7AAC7A",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    transform: [
      { perspective: 100 },
      { rotateX: "-30deg" },
    ],
  },
  baseSide: {
    position: "absolute",
    bottom: 0,
    width: TILE_WIDTH,
    height: TILE_HEIGHT / 2,
    backgroundColor: "#5C8A5C",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  buildingContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  levelBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.light.gold,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: Colors.light.warmWhite,
  },
  levelText: {
    fontSize: 10,
    fontFamily: "Nunito-Bold",
    color: Colors.light.darkWood,
  },
  countBadge: {
    position: "absolute",
    bottom: -8,
    left: -8,
    backgroundColor: Colors.light.sage,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: Colors.light.warmWhite,
  },
  countText: {
    fontSize: 10,
    fontFamily: "Nunito-Bold",
    color: Colors.light.warmWhite,
  },
  smoke: {
    position: "absolute",
    top: -20,
    width: 20,
    height: 20,
  },
  smokeParticle: {
    width: 16,
    height: 16,
    backgroundColor: "#CCCCCC",
    borderRadius: 8,
    opacity: 0.6,
  },
});
