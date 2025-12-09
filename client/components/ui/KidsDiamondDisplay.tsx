import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence, withRepeat, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { DiamondIcon } from '@/components/DiamondIcon';
import { formatNumber } from '@/lib/gameData';
import { KidsColors, KidsShadows } from '@/constants/kidsCartoonTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsDiamondDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  showPlus?: boolean;
  animate?: boolean;
}

export function KidsDiamondDisplay({ amount, size = 'md', onPress, showPlus = false, animate = false }: KidsDiamondDisplayProps) {
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  
  React.useEffect(() => {
    if (animate) {
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      );
    }
  }, [animate]);
  
  const sizes = {
    sm: { icon: 22, text: 14, paddingH: 12, paddingV: 6, radius: 20 },
    md: { icon: 28, text: 17, paddingH: 16, paddingV: 8, radius: 24 },
    lg: { icon: 38, text: 22, paddingH: 20, paddingV: 10, radius: 28 },
  };
  
  const config = sizes[size];
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmer.value * 0.4,
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };
  
  const Container = onPress ? AnimatedPressable : Animated.View;
  
  return (
    <Container
      style={[styles.container, animatedStyle, { borderRadius: config.radius }]}
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
    >
      <LinearGradient
        colors={['#E0F7FA', '#80DEEA']}
        style={[styles.gradient, { borderRadius: config.radius, paddingHorizontal: config.paddingH, paddingVertical: config.paddingV }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animated.View style={[styles.shine, shimmerStyle]} />
        <DiamondIcon size={config.icon} />
        <ThemedText style={[styles.text, { fontSize: config.text }]}>
          {showPlus ? '+' : ''}{formatNumber(amount)}
        </ThemedText>
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    ...KidsShadows.coloredFloat('#00BCD4'),
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 3,
    borderColor: '#4DD0E1',
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    fontFamily: 'FredokaOne',
    color: '#00838F',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
