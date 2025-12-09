import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { KidsColors, KidsShadows, KidsRadius, KidsSizes, KidsAnimations } from '@/constants/kidsCartoonTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'premium' | 'coin' | 'diamond';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const getGradientColors = (variant: string): readonly [string, string, ...string[]] => {
  switch (variant) {
    case 'primary':
      return ['#81C784', '#66BB6A'] as const;
    case 'secondary':
      return ['#64B5F6', '#42A5F5'] as const;
    case 'accent':
      return ['#FFB74D', '#FFA726'] as const;
    case 'danger':
      return ['#E57373', '#EF5350'] as const;
    case 'premium':
      return ['#CE93D8', '#AB47BC'] as const;
    case 'coin':
      return ['#FFE57F', '#FFD700', '#FFC107'] as const;
    case 'diamond':
      return ['#80DEEA', '#00BCD4', '#00ACC1'] as const;
    default:
      return ['#81C784', '#66BB6A'] as const;
  }
};

export function KidsButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: KidsButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, KidsAnimations.pop);
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.05, KidsAnimations.bounce),
      withSpring(1, KidsAnimations.spring)
    );
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      rotation.value = withSequence(
        withSpring(-3, { damping: 5, stiffness: 400 }),
        withSpring(3, { damping: 5, stiffness: 400 }),
        withSpring(0, { damping: 8, stiffness: 300 })
      );
      onPress();
    }
  };

  const sizeConfig = KidsSizes.button[size];
  const gradientColors = getGradientColors(variant);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <View style={[styles.buttonOuter, KidsShadows.medium]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.buttonGradient,
            { 
              height: sizeConfig.height,
              paddingHorizontal: sizeConfig.padding,
            },
          ]}
        >
          <View style={styles.shine} />
          <View style={styles.content}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <Text style={[styles.text, { fontSize: sizeConfig.fontSize }]}>
              {title}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  iconWrapper: {
    marginRight: 4,
  },
  text: {
    fontFamily: 'FredokaOne',
    color: KidsColors.text.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
