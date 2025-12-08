import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface BounceInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function BounceIn({ children, delay = 0, duration = 600 }: BounceInProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 8,
        stiffness: 100,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

interface FloatingProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
}

export function Floating({ children, distance = 10, duration = 2000 }: FloatingProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-distance, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}

export function PulseGlow({ children, color = '#FFD700', duration = 1500 }: PulseGlowProps) {
  const opacity = useSharedValue(0.5);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2 }),
        withTiming(0.5, { duration: duration / 2 })
      ),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 })
      ),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    position: 'absolute',
    width: '100%',
    height: '100%',
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  }));

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View style={glowStyle} />
      {children}
    </View>
  );
}

interface ShakeProps {
  children: React.ReactNode;
  trigger?: boolean;
}

export function Shake({ children, trigger = false }: ShakeProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

interface PopInProps {
  children: React.ReactNode;
  trigger?: boolean;
}

export function PopIn({ children, trigger = false }: PopInProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (trigger) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 5, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

interface RotatingSparkleProps {
  size?: number;
  color?: string;
}

export function RotatingSparkle({ size = 20, color = '#FFD700' }: RotatingSparkleProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, { width: size, height: size }]}>
      <View style={[styles.sparkle, { width: size, height: size }]}>
        <View style={[styles.sparkleBeam, { backgroundColor: color, width: size, height: size / 5 }]} />
        <View style={[styles.sparkleBeam, { backgroundColor: color, width: size / 5, height: size, position: 'absolute' }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sparkle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sparkleBeam: {
    borderRadius: 999,
  },
});
