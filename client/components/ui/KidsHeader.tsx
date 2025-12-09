import React from 'react';
import { View, StyleSheet, Image, Pressable, Dimensions, ImageSourcePropType } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { KidsColors, KidsShadows, KidsRadius, KidsAnimations } from '@/constants/kidsCartoonTheme';
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
      withSpring(0.9, KidsAnimations.pop),
      withSpring(1, KidsAnimations.spring)
    );
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View style={[styles.districtButton, KidsShadows.medium]}>
        <LinearGradient
          colors={['#FFFFFF', '#E3F2FD']}
          style={styles.districtGradient}
        >
          <Image source={logo} style={styles.districtLogo} resizeMode="cover" />
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}

function SettingsButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotation.value = withSpring(90, { damping: 10, stiffness: 200 });
    setTimeout(() => {
      rotation.value = withSpring(0, { damping: 10, stiffness: 200 });
    }, 200);
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View style={[styles.settingsButton, KidsShadows.soft]}>
        <LinearGradient
          colors={['#90CAF9', '#64B5F6']}
          style={styles.settingsGradient}
        >
          <View style={styles.settingsShine} />
          <Feather name="settings" size={20} color="#FFFFFF" />
        </LinearGradient>
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
  return (
    <View style={styles.container}>
      {/* Left: District Logo */}
      <DistrictButton logo={districtLogo} onPress={onDistrictPress} />

      {/* Center: Currency Displays */}
      <View style={styles.currencyContainer}>
        <KidsCurrencyDisplay type="coin" amount={coins} size="md" />
        <KidsCurrencyDisplay
          type="diamond"
          amount={diamonds}
          size="md"
          onPress={onDiamondPress}
        />
      </View>

      {/* Right: Settings */}
      <SettingsButton onPress={onSettingsPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  districtButton: {
    width: 50,
    height: 50,
    borderRadius: KidsRadius.md,
    overflow: 'hidden',
  },
  districtGradient: {
    flex: 1,
    padding: 3,
    borderRadius: KidsRadius.md,
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  districtLogo: {
    flex: 1,
    borderRadius: KidsRadius.sm,
  },
  currencyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  settingsGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#BBDEFB',
    position: 'relative',
    overflow: 'hidden',
  },
  settingsShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
});
