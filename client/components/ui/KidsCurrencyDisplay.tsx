import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle, Path, Ellipse, Text as SvgText } from 'react-native-svg';
import { KidsColors, KidsShadows, KidsRadius, KidsSizes, KidsAnimations } from '@/constants/kidsCartoonTheme';
import { formatNumber } from '@/lib/gameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsCurrencyDisplayProps {
  type: 'coin' | 'diamond';
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  showPlus?: boolean;
}

function CoinSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="coinGradient" cx="35%" cy="35%" r="60%">
          <Stop offset="0%" stopColor="#FFEB3B" />
          <Stop offset="50%" stopColor="#FFD700" />
          <Stop offset="100%" stopColor="#FFA000" />
        </RadialGradient>
        <RadialGradient id="coinShine" cx="30%" cy="25%" r="30%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="20" cy="20" r="18" fill="url(#coinGradient)" />
      <Circle cx="20" cy="20" r="14" fill="#FFC107" stroke="#FFB300" strokeWidth="1" />
      <Circle cx="20" cy="20" r="18" fill="url(#coinShine)" />
      <SvgText x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#D84315">$</SvgText>
    </Svg>
  );
}

function DiamondSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="diamondGradient" cx="40%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#80DEEA" />
          <Stop offset="50%" stopColor="#26C6DA" />
          <Stop offset="100%" stopColor="#00838F" />
        </RadialGradient>
        <RadialGradient id="diamondShine" cx="25%" cy="20%" r="25%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Path
        d="M20 4 L34 15 L20 36 L6 15 Z"
        fill="url(#diamondGradient)"
      />
      <Path
        d="M20 4 L28 15 L20 28 L12 15 Z"
        fill="#4DD0E1"
        opacity="0.6"
      />
      <Ellipse cx="15" cy="12" rx="5" ry="4" fill="url(#diamondShine)" />
    </Svg>
  );
}

export function KidsCurrencyDisplay({
  type,
  amount,
  size = 'md',
  onPress,
  showPlus = false,
}: KidsCurrencyDisplayProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, KidsAnimations.pop);
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.08, KidsAnimations.bounce),
      withSpring(1, KidsAnimations.spring)
    );
  };

  const sizeConfig = KidsSizes.currency[size];
  const isCoin = type === 'coin';
  
  const gradientColors = isCoin
    ? ['#FFF8E1', '#FFECB3'] as const
    : ['#E0F7FA', '#B2EBF2'] as const;
  
  const borderColor = isCoin ? '#FFE082' : '#80DEEA';

  const content = (
    <View style={[styles.container, KidsShadows.soft]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderColor }]}
      >
        <View style={styles.shine} />
        <View style={styles.content}>
          {isCoin ? (
            <CoinSvg size={sizeConfig.icon} />
          ) : (
            <DiamondSvg size={sizeConfig.icon} />
          )}
          <Text style={[styles.text, { fontSize: sizeConfig.text }]}>
            {showPlus && '+'}{formatNumber(amount)}
          </Text>
          {onPress && (
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>+</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return <Animated.View style={animatedStyle}>{content}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: KidsRadius.round,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: KidsRadius.round,
    borderWidth: 2,
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
    borderTopLeftRadius: KidsRadius.round,
    borderTopRightRadius: KidsRadius.round,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  text: {
    fontFamily: 'FredokaOne',
    color: '#37474F',
  },
  plusBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#66BB6A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  plusText: {
    fontFamily: 'FredokaOne',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: -1,
  },
});
