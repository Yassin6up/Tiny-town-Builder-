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
    <View style={styles.container}>
      <Animated.View style={sparkleStyle}>
        <Feather name="zap" size={16} color={Colors.light.darkWood} />
      </Animated.View>
      <ThemedText style={styles.text}>
        2x Income Active
      </ThemedText>
      <ThemedText style={styles.timer}>{timeRemaining}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.light.gold,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: 20,
    zIndex: 10,
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
