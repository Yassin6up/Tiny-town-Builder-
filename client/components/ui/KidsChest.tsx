import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Path, Circle, Ellipse } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { KidsColors, KidsShadows, KidsRadius, KidsAnimations } from '@/constants/kidsCartoonTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsChestProps {
  onTap: () => void;
  tapAmount: number;
}

function ChestSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size * 0.85} viewBox="0 0 120 100">
      <Defs>
        <RadialGradient id="chestBody" cx="50%" cy="40%" r="60%">
          <Stop offset="0%" stopColor="#A1887F" />
          <Stop offset="50%" stopColor="#8D6E63" />
          <Stop offset="100%" stopColor="#5D4037" />
        </RadialGradient>
        <RadialGradient id="chestTop" cx="50%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#BCAAA4" />
          <Stop offset="50%" stopColor="#8D6E63" />
          <Stop offset="100%" stopColor="#4E342E" />
        </RadialGradient>
        <RadialGradient id="goldTrim" cx="50%" cy="30%" r="60%">
          <Stop offset="0%" stopColor="#FFE082" />
          <Stop offset="50%" stopColor="#FFD54F" />
          <Stop offset="100%" stopColor="#FFA000" />
        </RadialGradient>
        <RadialGradient id="lockGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFEB3B" />
          <Stop offset="100%" stopColor="#FFC107" />
        </RadialGradient>
      </Defs>
      
      {/* Shadow */}
      <Ellipse cx="60" cy="95" rx="45" ry="8" fill="rgba(0,0,0,0.2)" />
      
      {/* Chest Body */}
      <Rect x="15" y="45" width="90" height="45" rx="6" fill="url(#chestBody)" />
      <Rect x="18" y="48" width="84" height="39" rx="4" fill="#795548" opacity="0.4" />
      
      {/* Gold Trim - Bottom */}
      <Rect x="12" y="68" width="96" height="8" rx="3" fill="url(#goldTrim)" />
      <Rect x="12" y="85" width="96" height="8" rx="3" fill="url(#goldTrim)" />
      
      {/* Chest Lid (Curved) */}
      <Path
        d="M15 48 Q15 20, 60 15 Q105 20, 105 48 L105 48 L15 48 Z"
        fill="url(#chestTop)"
      />
      <Path
        d="M20 46 Q20 25, 60 21 Q100 25, 100 46"
        fill="none"
        stroke="#A1887F"
        strokeWidth="2"
      />
      
      {/* Gold Trim - Top */}
      <Path
        d="M14 48 Q14 22, 60 17 Q106 22, 106 48"
        fill="none"
        stroke="url(#goldTrim)"
        strokeWidth="4"
      />
      
      {/* Lock */}
      <Circle cx="60" cy="55" r="14" fill="url(#lockGlow)" />
      <Circle cx="60" cy="55" r="10" fill="#FFC107" />
      <Rect x="56" y="60" width="8" height="10" rx="2" fill="#FFB300" />
      <Circle cx="60" cy="55" r="4" fill="#5D4037" />
      
      {/* Sparkles */}
      <Circle cx="35" cy="25" r="2" fill="#FFFFFF" opacity="0.8" />
      <Circle cx="85" cy="30" r="2.5" fill="#FFFFFF" opacity="0.7" />
      <Circle cx="45" cy="40" r="1.5" fill="#FFE082" opacity="0.9" />
    </Svg>
  );
}

function SparkleParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1.2),
          withSpring(0.8)
        ),
        -1,
        true
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-10, { duration: 600 }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.sparkle,
        { left: x, top: y },
        animatedStyle,
      ]}
    >
      <Text style={styles.sparkleText}>✨</Text>
    </Animated.View>
  );
}

export function KidsChest({ onTap, tapAmount }: KidsChestProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.5);
  const burstOpacity = useSharedValue(0);
  const burstY = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const chestStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: burstOpacity.value,
    transform: [{ translateY: burstY.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Bouncy squish animation
    scale.value = withSequence(
      withSpring(0.8, { damping: 4, stiffness: 400 }),
      withSpring(1.15, { damping: 5, stiffness: 200 }),
      withSpring(0.95, { damping: 8, stiffness: 250 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    // Wiggle animation
    rotation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 100 }),
      withTiming(-6, { duration: 80 }),
      withTiming(6, { duration: 60 }),
      withTiming(0, { duration: 50 })
    );

    // Coin burst text
    burstOpacity.value = 1;
    burstY.value = 0;
    burstOpacity.value = withDelay(200, withTiming(0, { duration: 800 }));
    burstY.value = withTiming(-80, { duration: 800, easing: Easing.out(Easing.cubic) });

    onTap();
  };

  const chestSize = Math.min(SCREEN_WIDTH * 0.35, 140);

  return (
    <View style={styles.container}>
      {/* Sparkle particles */}
      <SparkleParticle delay={0} x={-30} y={-20} />
      <SparkleParticle delay={400} x={30} y={-10} />
      <SparkleParticle delay={800} x={-20} y={10} />
      <SparkleParticle delay={200} x={40} y={-30} />

      {/* Glow effect */}
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={['rgba(255, 215, 0, 0.4)', 'rgba(255, 193, 7, 0.1)', 'transparent']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Coin burst */}
      <Animated.View style={[styles.coinBurst, burstStyle]} pointerEvents="none">
        <Text style={styles.burstText}>+{tapAmount}</Text>
      </Animated.View>

      {/* Chest */}
      <AnimatedPressable onPress={handlePress} style={chestStyle}>
        <ChestSvg size={chestSize} />
      </AnimatedPressable>

      {/* Tap hint */}
      <View style={styles.hintContainer}>
        <LinearGradient
          colors={['#66BB6A', '#43A047']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.hintBadge}
        >
          <Text style={styles.hintText}>Tap! +{tapAmount} 🪙</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  glowGradient: {
    flex: 1,
    borderRadius: 100,
  },
  sparkle: {
    position: 'absolute',
    zIndex: 10,
  },
  sparkleText: {
    fontSize: 20,
  },
  coinBurst: {
    position: 'absolute',
    top: -40,
    alignItems: 'center',
    zIndex: 20,
  },
  burstText: {
    fontFamily: 'FredokaOne',
    fontSize: 32,
    color: '#FFD700',
    textShadowColor: '#FF8F00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  hintContainer: {
    marginTop: 12,
  },
  hintBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: KidsRadius.round,
    ...KidsShadows.soft,
  },
  hintText: {
    fontFamily: 'FredokaOne',
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
