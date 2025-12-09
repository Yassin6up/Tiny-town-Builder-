import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { TinyTownColors, KidsShadows, KidsRadius, KidsSizes, KidsAnimations } from '@/constants/kidsCartoonTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'pink' | 'diamond' | 'disabled';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const getButtonColors = (variant: string): { gradient: readonly [string, string, ...string[]]; bottom: string } => {
  switch (variant) {
    case 'primary':
      return { 
        gradient: ['#81C784', '#4CAF50', '#43A047'] as const, 
        bottom: '#2E7D32' 
      };
    case 'secondary':
      return { 
        gradient: ['#64B5F6', '#42A5F5', '#1E88E5'] as const, 
        bottom: '#1565C0' 
      };
    case 'gold':
      return { 
        gradient: ['#FFE082', '#FFB84D', '#FFA726'] as const, 
        bottom: '#F57C00' 
      };
    case 'pink':
      return { 
        gradient: ['#FF9DC4', '#FF6B9D', '#E91E63'] as const, 
        bottom: '#C2185B' 
      };
    case 'diamond':
      return { 
        gradient: ['#80EAFF', '#00D4FF', '#00ACC1'] as const, 
        bottom: '#00838F' 
      };
    case 'disabled':
      return { 
        gradient: ['#E0E0E0', '#BDBDBD', '#9E9E9E'] as const, 
        bottom: '#757575' 
      };
    default:
      return { 
        gradient: ['#81C784', '#4CAF50', '#43A047'] as const, 
        bottom: '#2E7D32' 
      };
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
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = () => {
    translateY.value = withTiming(3, { duration: 80 });
    scale.value = withSpring(0.97, KidsAnimations.pop);
  };

  const handlePressOut = () => {
    translateY.value = withTiming(0, { duration: 100 });
    scale.value = withSequence(
      withSpring(1.03, KidsAnimations.bounce),
      withSpring(1, KidsAnimations.spring)
    );
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const sizeConfig = KidsSizes.button[size];
  const buttonColors = disabled ? getButtonColors('disabled') : getButtonColors(variant);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.7 },
        style,
      ]}
    >
      <View style={[styles.buttonOuter, { backgroundColor: buttonColors.bottom }]}>
        <LinearGradient
          colors={buttonColors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.buttonGradient,
            { 
              height: sizeConfig.height,
              paddingHorizontal: sizeConfig.padding,
              borderRadius: KidsRadius.lg,
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
        <View style={[styles.bottomBorder, { height: sizeConfig.borderBottom, backgroundColor: buttonColors.bottom }]} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
    ...KidsShadows.medium,
  },
  buttonGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 1,
  },
  iconWrapper: {
    marginRight: 2,
  },
  text: {
    fontFamily: 'FredokaOne',
    color: TinyTownColors.text.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: KidsRadius.lg,
    borderBottomRightRadius: KidsRadius.lg,
  },
});
