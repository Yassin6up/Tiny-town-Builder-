import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
import { TinyTownColors, KidsShadows, KidsRadius, KidsSizes, KidsAnimations, GlassConfig } from '@/constants/kidsCartoonTheme';
import { formatNumber } from '@/lib/gameData';

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
          <Stop offset="0%" stopColor="#FFE082" />
          <Stop offset="50%" stopColor="#FFB84D" />
          <Stop offset="100%" stopColor="#F5A623" />
        </RadialGradient>
        <RadialGradient id="coinShine" cx="30%" cy="25%" r="30%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="20" cy="21" r="17" fill="#F5A623" />
      <Circle cx="20" cy="19" r="17" fill="url(#coinGradient)" />
      <Circle cx="20" cy="19" r="13" fill="#FFB84D" stroke="#F5A623" strokeWidth="1.5" />
      <Circle cx="20" cy="19" r="17" fill="url(#coinShine)" />
      <SvgText x="20" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#F5A623">$</SvgText>
    </Svg>
  );
}

function DiamondSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="diamondGradient" cx="40%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#80EAFF" />
          <Stop offset="50%" stopColor="#00D4FF" />
          <Stop offset="100%" stopColor="#00ACC1" />
        </RadialGradient>
        <RadialGradient id="diamondShine" cx="25%" cy="20%" r="25%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Path
        d="M20 6 L33 16 L20 35 L7 16 Z"
        fill="#00ACC1"
        transform="translate(0, 1)"
      />
      <Path
        d="M20 5 L33 15 L20 34 L7 15 Z"
        fill="url(#diamondGradient)"
      />
      <Path
        d="M20 5 L27 15 L20 26 L13 15 Z"
        fill="#00D4FF"
        opacity="0.7"
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
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, KidsAnimations.pop);
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.06, KidsAnimations.bounce),
      withSpring(1, KidsAnimations.spring)
    );
  };

  const sizeConfig = KidsSizes.currency[size];
  const isCoin = type === 'coin';

  const backgroundColor = isCoin 
    ? 'rgba(255, 248, 225, 0.95)' 
    : 'rgba(224, 247, 250, 0.95)';
  
  const borderColor = isCoin ? TinyTownColors.coin.main : TinyTownColors.diamond.main;
  const bottomBorderColor = isCoin ? TinyTownColors.coin.shadow : TinyTownColors.diamond.dark;
  const textColor = isCoin ? TinyTownColors.text.gold : TinyTownColors.diamond.dark;

  const content = (
    <View style={[styles.container, KidsShadows.soft, { borderColor: bottomBorderColor }]}>
      <View style={[styles.innerContainer, { backgroundColor, borderColor }]}>
        <View style={styles.shine} />
        <View style={styles.content}>
          {isCoin ? (
            <CoinSvg size={sizeConfig.icon} />
          ) : (
            <DiamondSvg size={sizeConfig.icon} />
          )}
          <Text style={[styles.text, { fontSize: sizeConfig.text, color: textColor }]}>
            {showPlus && '+'}{formatNumber(amount)}
          </Text>
          {onPress && (
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>+</Text>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.bottomBorder, { backgroundColor: bottomBorderColor }]} />
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
    borderBottomWidth: 3,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
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
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  plusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: TinyTownColors.success.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    borderWidth: 1.5,
    borderColor: TinyTownColors.success.dark,
  },
  plusText: {
    fontFamily: 'FredokaOne',
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: -1,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: KidsRadius.round,
    borderBottomRightRadius: KidsRadius.round,
  },
});
