import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useGame } from "@/lib/GameContext";
import { Colors, Spacing } from "@/constants/theme";
import { GoldTextureSvg } from "@/components/textures";

export function BoostBanner() {
  const { state } = useGame();
  const [timeRemaining, setTimeRemaining] = useState("");
  const sparkleOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (state.adBoostActive) {
      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.5, { duration: 500 })
        ),
        -1,
        true
      );

      const interval = setInterval(() => {
        const remaining = Math.max(0, state.adBoostEndTime - Date.now());
        if (remaining <= 0) {
          setTimeRemaining("");
          return;
        }
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.adBoostActive, state.adBoostEndTime]);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  if (!state.adBoostActive || state.adBoostEndTime <= Date.now()) {
    return null;
  }

  return (
    <View style={styles.bannerWrapper}>
      <View style={styles.bannerTexture}>
        <GoldTextureSvg width={280} height={50} variant="bright" borderRadius={20} />
      </View>
      <View style={styles.container}>
      <Animated.View style={sparkleStyle}>
        <Feather name="zap" size={16} color="#FFFFFF" />
      </Animated.View>
      <ThemedText style={[styles.text, { 
        color: "#FFFFFF",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      }]}>
        2x Income Active
      </ThemedText>
      <ThemedText style={[styles.timer, {
        color: "#FFFFFF",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      }]}>{timeRemaining}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    position: "relative",
    marginHorizontal: Spacing.lg,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
    zIndex: 10,
  },
  bannerTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
  },
  text: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.light.darkWood,
  },
  timer: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: Colors.light.darkWood,
  },
});
