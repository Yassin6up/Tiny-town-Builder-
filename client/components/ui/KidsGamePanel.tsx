import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TinyTownColors, KidsShadows, KidsRadius } from '@/constants/kidsCartoonTheme';

type PanelVariant = 'white' | 'cream' | 'blue' | 'pink' | 'mint' | 'gold' | 'purple' | 'glass';
type PanelSize = 'sm' | 'md' | 'lg';

interface KidsGamePanelProps {
  children: React.ReactNode;
  variant?: PanelVariant;
  size?: PanelSize;
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
}

const VARIANT_CONFIG: Record<PanelVariant, { colors: readonly [string, string]; border: string; bottom: string }> = {
  white: { colors: ['#FFFFFF', '#FAFAFA'], border: '#F0F0F0', bottom: '#E0E0E0' },
  cream: { colors: [TinyTownColors.background.warmCream, '#FFF5E0'], border: TinyTownColors.primary.light, bottom: TinyTownColors.primary.dark },
  blue: { colors: ['#E3F2FD', '#BBDEFB'], border: '#90CAF9', bottom: '#64B5F6' },
  pink: { colors: [TinyTownColors.pink.light + '60', TinyTownColors.pink.light], border: TinyTownColors.pink.main + '60', bottom: TinyTownColors.pink.main },
  mint: { colors: [TinyTownColors.success.light + '60', TinyTownColors.success.light], border: TinyTownColors.success.main + '40', bottom: TinyTownColors.success.main },
  gold: { colors: [TinyTownColors.primary.light + '60', TinyTownColors.primary.light], border: TinyTownColors.primary.main + '60', bottom: TinyTownColors.primary.dark },
  purple: { colors: ['#F3E5F5', '#E1BEE7'], border: '#CE93D8', bottom: '#AB47BC' },
  glass: { colors: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'], border: 'rgba(255,255,255,0.5)', bottom: 'rgba(0,0,0,0.1)' },
};

const SIZE_CONFIG = {
  sm: { padding: 14, radius: KidsRadius.md, borderWidth: 2, bottomHeight: 4 },
  md: { padding: 18, radius: KidsRadius.lg, borderWidth: 2, bottomHeight: 5 },
  lg: { padding: 24, radius: KidsRadius.xl, borderWidth: 2, bottomHeight: 6 },
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
    <View style={[styles.outerContainer, { borderRadius: sizeConfig.radius, backgroundColor: variantConfig.bottom }]}>
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
        <View style={[styles.shine, { borderTopLeftRadius: sizeConfig.radius, borderTopRightRadius: sizeConfig.radius }]} />
        {children}
      </LinearGradient>
      <View style={[styles.bottomBorder, { height: sizeConfig.bottomHeight, backgroundColor: variantConfig.bottom, borderBottomLeftRadius: sizeConfig.radius, borderBottomRightRadius: sizeConfig.radius }]} />
    </View>
  );
  
  if (animated) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).springify().damping(14)}
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
    ...KidsShadows.card,
  },
  outerContainer: {
    overflow: 'hidden',
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
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
