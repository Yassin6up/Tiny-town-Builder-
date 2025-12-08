import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { CoinIcon } from "./CoinIcon";
import { ThemedText } from "./ThemedText";
import { formatNumber } from "@/lib/gameData";

interface FlyingCoinProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  amount: number;
  onComplete: () => void;
}

export function FlyingCoin({ startX, startY, endX, endY, amount, onComplete }: FlyingCoinProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Phase 1: Fade in and scale up at building position (500ms)
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
      withDelay(200, withTiming(1, { duration: 200 }))
    );

    // Phase 2: After showing price, fly to top (delayed by 500ms)
    translateX.value = withDelay(
      500,
      withTiming(endX - startX, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );

    translateY.value = withDelay(
      500,
      withTiming(endY - startY, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );

    // Phase 3: Scale and fade during flight
    scale.value = withDelay(
      500,
      withTiming(0.6, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      })
    );

    opacity.value = withDelay(
      1200,
      withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { left: startX, top: startY }, animatedStyle]}>
      <CoinIcon size={40} />
      <ThemedText style={styles.amountText}>+{formatNumber(amount)}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  amountText: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: "#FFD700",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginTop: 4,
  },
});
