import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { KidsColors, KidsShadows, KidsRadius } from '@/constants/kidsCartoonTheme';

type PanelVariant = 'white' | 'cream' | 'blue' | 'pink' | 'mint' | 'gold' | 'purple';
type PanelSize = 'sm' | 'md' | 'lg';

interface KidsGamePanelProps {
  children: React.ReactNode;
  variant?: PanelVariant;
  size?: PanelSize;
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
}

const VARIANT_CONFIG: Record<PanelVariant, { colors: readonly [string, string]; border: string }> = {
  white: { colors: ['#FFFFFF', '#F5F5F5'], border: '#E0E0E0' },
  cream: { colors: ['#FFF9E6', '#FFE082'], border: '#FFD54F' },
  blue: { colors: ['#E3F2FD', '#BBDEFB'], border: '#90CAF9' },
  pink: { colors: ['#FCE4EC', '#F8BBD9'], border: '#F48FB1' },
  mint: { colors: ['#E8F5E9', '#C8E6C9'], border: '#A5D6A7' },
  gold: { colors: ['#FFF8E1', '#FFECB3'], border: '#FFD54F' },
  purple: { colors: ['#F3E5F5', '#E1BEE7'], border: '#CE93D8' },
};

const SIZE_CONFIG = {
  sm: { padding: 14, radius: KidsRadius.md, borderWidth: 2 },
  md: { padding: 18, radius: KidsRadius.lg, borderWidth: 3 },
  lg: { padding: 24, radius: KidsRadius.xl, borderWidth: 3 },
};

export function KidsGamePanel({
  children,
  variant = 'white',
  size = 'md',
  style,
  animated = true,
  delay = 0,
}: KidsGamePanelProps) {
  const variantConfig = VARIANT_CONFIG[variant];
  const sizeConfig = SIZE_CONFIG[size];
  
  const content = (
    <LinearGradient
      colors={variantConfig.colors}
      style={[
        styles.gradient,
        {
          padding: sizeConfig.padding,
          borderRadius: sizeConfig.radius,
          borderWidth: sizeConfig.borderWidth,
          borderColor: variantConfig.border,
        },
        style,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.shine} />
      {children}
    </LinearGradient>
  );
  
  if (animated) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).springify().damping(12)}
        style={[styles.container, { borderRadius: sizeConfig.radius }]}
      >
        {content}
      </Animated.View>
    );
  }
  
  return (
    <View style={[styles.container, { borderRadius: sizeConfig.radius }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...KidsShadows.medium,
  },
  gradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
