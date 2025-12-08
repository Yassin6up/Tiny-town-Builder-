import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from "react-native-reanimated";

interface ParticleEffectProps {
  type: "coins" | "smoke" | "sparkles" | "leaves" | "stars";
  active?: boolean;
  count?: number;
}

export function ParticleEffect({ type, active = true, count = 5 }: ParticleEffectProps) {
  if (!active) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Particle key={index} type={type} delay={index * 200} />
      ))}
    </View>
  );
}

interface ParticleProps {
  type: "coins" | "smoke" | "sparkles" | "leaves" | "stars";
  delay: number;
}

function Particle({ type, delay }: ParticleProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const randomX = Math.random() * 40 - 20;
    
    if (type === "coins") {
      // Coins burst upward
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(-80, { duration: 800, easing: Easing.out(Easing.cubic) })
          ),
          -1,
          false
        )
      );
      translateX.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(randomX, { duration: 800 })
          ),
          -1,
          false
        )
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 0 }),
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          -1,
          false
        )
      );
      rotate.value = withDelay(
        delay,
        withRepeat(
          withTiming(360, { duration: 800, easing: Easing.linear }),
          -1,
          false
        )
      );
    } else if (type === "smoke") {
      // Smoke rises and fades
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(-60, { duration: 2000, easing: Easing.out(Easing.ease) })
          ),
          -1,
          false
        )
      );
      translateX.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(randomX * 0.5, { duration: 2000 })
          ),
          -1,
          false
        )
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 0 }),
            withTiming(0, { duration: 2000 })
          ),
          -1,
          false
        )
      );
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 0 }),
            withTiming(2, { duration: 2000 })
          ),
          -1,
          false
        )
      );
    } else if (type === "sparkles") {
      // Sparkles twinkle and float
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(-30, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
      translateX.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(randomX * 0.3, { duration: 750 }),
            withTiming(-randomX * 0.3, { duration: 750 })
          ),
          -1,
          true
        )
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.2, { duration: 400 }),
            withTiming(1, { duration: 400 })
          ),
          -1,
          true
        )
      );
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.2, { duration: 600 }),
            withTiming(0.8, { duration: 600 })
          ),
          -1,
          true
        )
      );
    } else if (type === "leaves") {
      // Leaves fall and sway
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(100, { duration: 3000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
      translateX.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(randomX, { duration: 1500 }),
            withTiming(-randomX, { duration: 1500 })
          ),
          -1,
          true
        )
      );
      rotate.value = withDelay(
        delay,
        withRepeat(
          withTiming(360, { duration: 2000, easing: Easing.linear }),
          -1,
          false
        )
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.8, { duration: 0 }),
            withTiming(0.8, { duration: 2500 }),
            withTiming(0, { duration: 500 })
          ),
          -1,
          false
        )
      );
    } else if (type === "stars") {
      // Stars twinkle in place
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.5, { duration: 800 }),
            withTiming(0.5, { duration: 800 })
          ),
          -1,
          true
        )
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1,
          true
        )
      );
    }
  }, [type, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      {type === "coins" && <CoinParticle />}
      {type === "smoke" && <SmokeParticle />}
      {type === "sparkles" && <SparkleParticle />}
      {type === "leaves" && <LeafParticle />}
      {type === "stars" && <StarParticle />}
    </Animated.View>
  );
}

function CoinParticle() {
  return <View style={[styles.shape, styles.coin]} />;
}

function SmokeParticle() {
  return <View style={[styles.shape, styles.smoke]} />;
}

function SparkleParticle() {
  return <View style={[styles.shape, styles.sparkle]} />;
}

function LeafParticle() {
  return <View style={[styles.shape, styles.leaf]} />;
}

function StarParticle() {
  return <View style={[styles.shape, styles.star]} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
  },
  shape: {
    width: 12,
    height: 12,
  },
  coin: {
    backgroundColor: "#FFD700",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  smoke: {
    backgroundColor: "#B0B0B0",
    borderRadius: 10,
    width: 16,
    height: 16,
  },
  sparkle: {
    backgroundColor: "#FFFF00",
    width: 8,
    height: 8,
    transform: [{ rotate: "45deg" }],
  },
  leaf: {
    backgroundColor: "#2D5016",
    borderRadius: 8,
    width: 10,
    height: 14,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  star: {
    backgroundColor: "#FFFFFF",
    width: 10,
    height: 10,
    transform: [{ rotate: "45deg" }],
  },
});
