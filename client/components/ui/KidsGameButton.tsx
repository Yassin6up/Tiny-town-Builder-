import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { KidsColors, KidsShadows, KidsRadius, KidsAnimations } from '@/constants/kidsCartoonTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'premium' | 'fun' | 'magic';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface KidsGameButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const VARIANT_COLORS: Record<ButtonVariant, readonly [string, string]> = {
  primary: KidsColors.button.primary,
  secondary: KidsColors.button.secondary,
  accent: KidsColors.button.accent,
  danger: KidsColors.button.danger,
  premium: KidsColors.button.premium,
  fun: KidsColors.button.fun,
  magic: KidsColors.button.magic,
};

const VARIANT_BORDER: Record<ButtonVariant, string> = {
  primary: '#2E7D32',
  secondary: '#1565C0',
  accent: '#FF8F00',
  danger: '#C62828',
  premium: '#6A1B9A',
  fun: '#C2185B',
  magic: '#4527A0',
};

const SIZE_CONFIG = {
  sm: { height: 44, paddingH: 18, fontSize: 15, iconGap: 6, radius: KidsRadius.lg },
  md: { height: 54, paddingH: 24, fontSize: 17, iconGap: 8, radius: KidsRadius.xl },
  lg: { height: 64, paddingH: 30, fontSize: 19, iconGap: 10, radius: KidsRadius.xl },
  xl: { height: 74, paddingH: 36, fontSize: 22, iconGap: 12, radius: KidsRadius.xxl },
};

export function KidsGameButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: KidsGameButtonProps) {
  const scale = useSharedValue(1);
  const config = SIZE_CONFIG[size];
  const colors = VARIANT_COLORS[variant];
  const borderColor = VARIANT_BORDER[variant];
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.92, KidsAnimations.pop);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, KidsAnimations.bounce);
  };
  
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.9, { duration: 50 }),
      withSpring(1.05, KidsAnimations.pop),
      withSpring(1, KidsAnimations.bounce)
    );
    onPress();
  };
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.container,
        animatedStyle,
        { borderRadius: config.radius },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={disabled ? ['#BDBDBD', '#9E9E9E'] : colors}
        style={[
          styles.gradient,
          {
            height: config.height,
            paddingHorizontal: config.paddingH,
            borderRadius: config.radius,
            borderColor: disabled ? '#757575' : borderColor,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.shine} />
        <View style={[styles.content, { gap: config.iconGap }]}>
          {icon && iconPosition === 'left' && icon}
          <ThemedText style={[styles.text, { fontSize: config.fontSize }]}>
            {title}
          </ThemedText>
          {icon && iconPosition === 'right' && icon}
        </View>
        <View style={styles.bottomShadow} />
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...KidsShadows.float,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontFamily: 'FredokaOne',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
});
