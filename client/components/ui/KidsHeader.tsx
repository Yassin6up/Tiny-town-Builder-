import React from 'react';
import { View, StyleSheet, Image, Pressable, Dimensions, ImageSourcePropType, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TinyTownColors, KidsShadows, KidsRadius, KidsAnimations, GlassConfig } from '@/constants/kidsCartoonTheme';
import { KidsCurrencyDisplay } from './KidsCurrencyDisplay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsHeaderProps {
  coins: number;
  diamonds: number;
  districtLogo: ImageSourcePropType;
  onDistrictPress: () => void;
  onDiamondPress: () => void;
  onSettingsPress: () => void;
}

function DistrictButton({ logo, onPress }: { logo: ImageSourcePropType; onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.88, KidsAnimations.pop),
      withSpring(1.05, KidsAnimations.bounce),
      withSpring(1, KidsAnimations.spring)
    );
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View style={[styles.districtButton, KidsShadows.float]}>
        <View style={styles.districtGradient}>
          <Image source={logo} style={styles.districtLogo} resizeMode="cover" />
        </View>
        <View style={styles.districtBorder} />
      </View>
    </AnimatedPressable>
  );
}

function SettingsButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const breathe = useSharedValue(1);

  React.useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * breathe.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotation.value = withSpring(180, { damping: 12, stiffness: 200 });
    scale.value = withSequence(
      withSpring(0.9, KidsAnimations.pop),
      withSpring(1, KidsAnimations.spring)
    );
    setTimeout(() => {
      rotation.value = withSpring(360, { damping: 12, stiffness: 200 });
    }, 150);
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View style={[styles.settingsOuter, KidsShadows.medium]}>
        <LinearGradient
          colors={[TinyTownColors.panel.white, '#F5F5F5']}
          style={styles.settingsGradient}
        >
          <View style={styles.settingsShine} />
          <Feather name="settings" size={20} color={TinyTownColors.text.primary} />
        </LinearGradient>
        <View style={styles.settingsBottomBorder} />
      </View>
    </AnimatedPressable>
  );
}

export function KidsHeader({
  coins,
  diamonds,
  districtLogo,
  onDistrictPress,
  onDiamondPress,
  onSettingsPress,
}: KidsHeaderProps) {
  const glassContent = (
    <View style={styles.headerContent}>
      <DistrictButton logo={districtLogo} onPress={onDistrictPress} />
      <View style={styles.currencyContainer}>
        <KidsCurrencyDisplay type="coin" amount={coins} size="md" />
        <KidsCurrencyDisplay
          type="diamond"
          amount={diamonds}
          size="md"
          onPress={onDiamondPress}
        />
      </View>
      <SettingsButton onPress={onSettingsPress} />
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webGlass]}>
        {glassContent}
      </View>
    );
  }

  return (
    <BlurView intensity={GlassConfig.blur} tint="light" style={styles.container}>
      <View style={styles.glassOverlay} />
      {glassContent}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: KidsRadius.xl,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  webGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: GlassConfig.backgroundColor,
    borderWidth: GlassConfig.borderWidth,
    borderColor: GlassConfig.borderColor,
    borderRadius: KidsRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  districtButton: {
    width: 52,
    height: 52,
    borderRadius: KidsRadius.md,
    overflow: 'hidden',
    backgroundColor: TinyTownColors.panel.white,
  },
  districtGradient: {
    flex: 1,
    padding: 3,
    borderRadius: KidsRadius.md,
    backgroundColor: TinyTownColors.panel.white,
  },
  districtLogo: {
    flex: 1,
    borderRadius: KidsRadius.sm,
  },
  districtBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: TinyTownColors.primary.dark,
    borderBottomLeftRadius: KidsRadius.md,
    borderBottomRightRadius: KidsRadius.md,
  },
  currencyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  settingsOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: TinyTownColors.text.primary,
  },
  settingsGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    position: 'relative',
    overflow: 'hidden',
  },
  settingsShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  settingsBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#BDBDBD',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
});
