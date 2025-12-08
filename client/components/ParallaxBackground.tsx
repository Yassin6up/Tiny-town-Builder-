import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { DistrictId } from "@/lib/gameData";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ParallaxBackgroundProps {
  districtId: DistrictId;
  scrollY?: Animated.SharedValue<number>;
}

const DISTRICT_LAYERS = {
  forest: {
    sky: ["#87CEEB", "#B0E0E6", "#F0F8FF"],
    mountains: ["#5C8A5C", "#6B9B6B", "#7AAC7A"],
    trees: ["#2D5016", "#3D6B26", "#4D7C36"],
  },
  coastal: {
    sky: ["#4A90E2", "#6CB4EE", "#87CEEB"],
    mountains: ["#6BA3D4", "#7CB3E4", "#8DC3F4"],
    trees: ["#2E5266", "#3E6276", "#4E7286"],
  },
  mountain: {
    sky: ["#B0C4DE", "#C8D9E8", "#E0EFF8"],
    mountains: ["#8B9DC3", "#9BADD3", "#ABBDE3"],
    trees: ["#5A6B7D", "#6A7B8D", "#7A8B9D"],
  },
  desert: {
    sky: ["#FFD89B", "#FFE4B5", "#FFF0D4"],
    mountains: ["#D2691E", "#E27B2E", "#F28D3E"],
    trees: ["#8B4513", "#9B5523", "#AB6533"],
  },
  skyline: {
    sky: ["#2C3E50", "#34495E", "#3D546E"],
    mountains: ["#556B8B", "#657B9B", "#758BAB"],
    trees: ["#1C2C3C", "#2C3C4C", "#3C4C5C"],
  },
};

export function ParallaxBackground({ districtId, scrollY }: ParallaxBackgroundProps) {
  const layers = DISTRICT_LAYERS[districtId];

  // Animated styles for parallax effect
  const skyStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SCREEN_HEIGHT],
            [0, -SCREEN_HEIGHT * 0.3]
          ),
        },
      ],
    };
  });

  const mountainStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SCREEN_HEIGHT],
            [0, -SCREEN_HEIGHT * 0.5]
          ),
        },
      ],
    };
  });

  const foregroundStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SCREEN_HEIGHT],
            [0, -SCREEN_HEIGHT * 0.7]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Sky Layer */}
      <Animated.View style={[styles.layer, skyStyle]}>
        <LinearGradient
          colors={layers.sky}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Mountain/Background Layer */}
      <Animated.View style={[styles.layer, styles.mountainLayer, mountainStyle]}>
        <LinearGradient
          colors={layers.mountains}
          style={styles.mountainGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        {districtId === "forest" && <ForestMountains />}
        {districtId === "coastal" && <CoastalWaves />}
        {districtId === "mountain" && <SnowPeaks />}
        {districtId === "desert" && <DesertDunes />}
        {districtId === "skyline" && <CityScape />}
      </Animated.View>

      {/* Foreground Layer */}
      <Animated.View style={[styles.layer, styles.foregroundLayer, foregroundStyle]}>
        <View style={styles.foreground}>
          {districtId === "forest" && <ForestForeground />}
          {districtId === "coastal" && <CoastalForeground />}
        </View>
      </Animated.View>
    </View>
  );
}

// Simplified SVG-style components (you'll replace these with actual images/SVGs)
function ForestMountains() {
  return (
    <View style={styles.mountains}>
      {/* Add forest mountain silhouettes here */}
    </View>
  );
}

function CoastalWaves() {
  return (
    <View style={styles.waves}>
      {/* Add animated waves here */}
    </View>
  );
}

function SnowPeaks() {
  return (
    <View style={styles.peaks}>
      {/* Add snowy mountain peaks */}
    </View>
  );
}

function DesertDunes() {
  return (
    <View style={styles.dunes}>
      {/* Add desert dune shapes */}
    </View>
  );
}

function CityScape() {
  return (
    <View style={styles.cityscape}>
      {/* Add building silhouettes */}
    </View>
  );
}

function ForestForeground() {
  return (
    <View style={styles.trees}>
      {/* Add tree silhouettes */}
    </View>
  );
}

function CoastalForeground() {
  return (
    <View style={styles.shore}>
      {/* Add shore elements */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  layer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 1.5,
    top: 0,
    left: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  mountainLayer: {
    bottom: 0,
    top: "auto",
    height: SCREEN_HEIGHT * 0.6,
  },
  mountainGradient: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  foregroundLayer: {
    bottom: 0,
    top: "auto",
    height: SCREEN_HEIGHT * 0.4,
  },
  foreground: {
    flex: 1,
  },
  mountains: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
  },
  waves: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
  },
  peaks: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
  },
  dunes: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%",
  },
  cityscape: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  trees: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  shore: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
  },
});
