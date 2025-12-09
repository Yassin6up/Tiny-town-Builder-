import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
  SlideInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import { KidsColors, KidsShadows, KidsRadius, KidsSpacing, KidsAnimations } from '@/constants/kidsCartoonTheme';
import { KidsButton } from './KidsButton';
import { KidsPanel } from './KidsPanel';
import { formatNumber } from '@/lib/gameData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface KidsOfflineModalProps {
  visible: boolean;
  earnings: number;
  onDismiss: () => void;
}

function CoinPile({ size }: { size: number }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <Defs>
        <RadialGradient id="coinG1" cx="35%" cy="35%" r="60%">
          <Stop offset="0%" stopColor="#FFEB3B" />
          <Stop offset="50%" stopColor="#FFD700" />
          <Stop offset="100%" stopColor="#FFA000" />
        </RadialGradient>
      </Defs>
      <Circle cx="30" cy="55" r="18" fill="url(#coinG1)" />
      <Circle cx="70" cy="55" r="18" fill="url(#coinG1)" />
      <Circle cx="50" cy="50" r="20" fill="url(#coinG1)" />
      <Circle cx="35" cy="35" r="16" fill="url(#coinG1)" />
      <Circle cx="65" cy="35" r="16" fill="url(#coinG1)" />
      <Circle cx="50" cy="25" r="14" fill="url(#coinG1)" />
      <Path d="M40 60 Q50 75 60 60" fill="none" stroke="#FFB300" strokeWidth="2" />
    </Svg>
  );
}

function FloatingCoin({ delay, startX }: { delay: number; startX: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      rotate.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingCoin, { left: startX }, animatedStyle]}>
      <Svg width={24} height={24} viewBox="0 0 40 40">
        <Defs>
          <RadialGradient id="floatCoin" cx="35%" cy="35%" r="60%">
            <Stop offset="0%" stopColor="#FFEB3B" />
            <Stop offset="100%" stopColor="#FFA000" />
          </RadialGradient>
        </Defs>
        <Circle cx="20" cy="20" r="18" fill="url(#floatCoin)" />
      </Svg>
    </Animated.View>
  );
}

export function KidsOfflineModal({ visible, earnings, onDismiss }: KidsOfflineModalProps) {
  const coinScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      coinScale.value = withSequence(
        withSpring(1.2, KidsAnimations.bounce),
        withSpring(1, KidsAnimations.spring)
      );
    }
  }, [visible]);

  const coinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coinScale.value }],
  }));

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View entering={SlideInUp.springify().damping(12)} style={styles.modalContainer}>
          <KidsPanel variant="gold" padding="lg" style={styles.modal}>
            <View style={styles.sparkles}>
              <FloatingCoin delay={0} startX={20} />
              <FloatingCoin delay={300} startX={80} />
              <FloatingCoin delay={600} startX={140} />
              <FloatingCoin delay={200} startX={200} />
            </View>

            <View style={styles.content}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['rgba(255, 235, 59, 0.3)', 'rgba(255, 193, 7, 0.1)', 'transparent']}
                  style={styles.iconGlow}
                />
                <Animated.View style={coinAnimatedStyle}>
                  <CoinPile size={100} />
                </Animated.View>
              </View>

              <Text style={styles.earnedLabel}>While you were away...</Text>
              
              <View style={styles.earningsContainer}>
                <LinearGradient
                  colors={['#FFF9C4', '#FFEB3B']}
                  style={styles.earningsGradient}
                >
                  <View style={styles.earningsShine} />
                  <Text style={styles.earningsAmount}>+{formatNumber(earnings)}</Text>
                  <Text style={styles.earningsLabel}>coins earned!</Text>
                </LinearGradient>
              </View>

              <KidsButton
                title="Collect!"
                onPress={onDismiss}
                variant="primary"
                size="lg"
                fullWidth
              />
            </View>
          </KidsPanel>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: KidsSpacing.lg,
  },
  modalContainer: {
    width: Math.min(SCREEN_WIDTH - 48, 320),
  },
  modal: {
    borderRadius: KidsRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  sparkles: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
  floatingCoin: {
    position: 'absolute',
    top: 0,
  },
  content: {
    alignItems: 'center',
    paddingTop: KidsSpacing.md,
  },
  welcomeText: {
    fontFamily: 'FredokaOne',
    fontSize: 28,
    color: '#5D4037',
    textAlign: 'center',
    marginBottom: KidsSpacing.md,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: KidsSpacing.md,
  },
  iconGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  earnedLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#795548',
    marginBottom: KidsSpacing.sm,
  },
  earningsContainer: {
    marginBottom: KidsSpacing.lg,
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
    ...KidsShadows.medium,
  },
  earningsGradient: {
    paddingHorizontal: KidsSpacing.xl,
    paddingVertical: KidsSpacing.md,
    alignItems: 'center',
    borderRadius: KidsRadius.lg,
    borderWidth: 2,
    borderColor: '#FFB300',
    position: 'relative',
    overflow: 'hidden',
  },
  earningsShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
  },
  earningsAmount: {
    fontFamily: 'FredokaOne',
    fontSize: 36,
    color: '#E65100',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  earningsLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#F57C00',
    marginTop: -2,
  },
});
