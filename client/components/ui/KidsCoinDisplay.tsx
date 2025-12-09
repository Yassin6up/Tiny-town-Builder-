import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { CoinIcon } from '@/components/CoinIcon';
import { formatNumber } from '@/lib/gameData';
import { KidsColors, KidsShadows, KidsRadius } from '@/constants/kidsCartoonTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsCoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  showPlus?: boolean;
}

export function KidsCoinDisplay({ amount, size = 'md', onPress, showPlus = false }: KidsCoinDisplayProps) {
  const scale = useSharedValue(1);
  
  const sizes = {
    sm: { icon: 24, text: 14, paddingH: 12, paddingV: 6, radius: 20 },
    md: { icon: 32, text: 17, paddingH: 16, paddingV: 8, radius: 24 },
    lg: { icon: 42, text: 22, paddingH: 20, paddingV: 10, radius: 28 },
  };
  
  const config = sizes[size];
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
        colors={['#FFF9E6', '#FFE082']}
        style={[styles.gradient, { borderRadius: config.radius, paddingHorizontal: config.paddingH, paddingVertical: config.paddingV }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.shine} />
        <CoinIcon size={config.icon} />
        <ThemedText style={[styles.text, { fontSize: config.text }]}>
          {showPlus ? '+' : ''}{formatNumber(amount)}
        </ThemedText>
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    ...KidsShadows.coloredFloat('#FFD700'),
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 3,
    borderColor: '#FFD54F',
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  text: {
    fontFamily: 'FredokaOne',
    color: '#FF8F00',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
