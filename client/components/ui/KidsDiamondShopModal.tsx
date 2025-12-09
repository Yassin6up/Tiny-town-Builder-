import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Path, Circle, Ellipse } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { KidsColors, KidsShadows, KidsRadius, KidsSpacing, KidsAnimations } from '@/constants/kidsCartoonTheme';
import { KidsButton } from './KidsButton';
import { KidsPanel } from './KidsPanel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsDiamondShopModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (diamonds: number, cost: number) => void;
  onWatchAd: () => void;
}

function DiamondPackSvg({ size, count }: { size: number; count: 'small' | 'medium' | 'large' | 'mega' }) {
  const diamondPositions = {
    small: [{ x: 20, y: 20 }],
    medium: [{ x: 12, y: 20 }, { x: 28, y: 20 }],
    large: [{ x: 10, y: 16 }, { x: 20, y: 24 }, { x: 30, y: 16 }],
    mega: [{ x: 8, y: 16 }, { x: 20, y: 12 }, { x: 32, y: 16 }, { x: 20, y: 26 }],
  };

  const positions = diamondPositions[count];

  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="packDiamond" cx="40%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#80DEEA" />
          <Stop offset="50%" stopColor="#26C6DA" />
          <Stop offset="100%" stopColor="#00838F" />
        </RadialGradient>
        <RadialGradient id="packShine" cx="25%" cy="20%" r="25%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {positions.map((pos, i) => (
        <React.Fragment key={i}>
          <Path
            d={`M${pos.x} ${pos.y - 6} L${pos.x + 6} ${pos.y} L${pos.x} ${pos.y + 8} L${pos.x - 6} ${pos.y} Z`}
            fill="url(#packDiamond)"
          />
          <Path
            d={`M${pos.x} ${pos.y - 6} L${pos.x + 3} ${pos.y} L${pos.x} ${pos.y + 4} L${pos.x - 3} ${pos.y} Z`}
            fill="#4DD0E1"
            opacity="0.6"
          />
          <Ellipse cx={pos.x - 2} cy={pos.y - 3} rx={2} ry={1.5} fill="url(#packShine)" />
        </React.Fragment>
      ))}
    </Svg>
  );
}

function PackCard({
  diamonds,
  cost,
  popular,
  packSize,
  onPurchase,
}: {
  diamonds: number;
  cost: number;
  popular: boolean;
  packSize: 'small' | 'medium' | 'large' | 'mega';
  onPurchase: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, KidsAnimations.pop);
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.03, KidsAnimations.bounce),
      withSpring(1, KidsAnimations.spring)
    );
  };

  const gradientColors = popular
    ? (['#CE93D8', '#BA68C8'] as const)
    : (['#E3F2FD', '#BBDEFB'] as const);

  const borderColor = popular ? '#9C27B0' : '#90CAF9';

  return (
    <AnimatedPressable
      onPress={onPurchase}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, styles.packCardPressable]}
    >
      <View style={[styles.packCard, KidsShadows.medium]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.packGradient, { borderColor }]}
        >
          {popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>BEST VALUE</Text>
            </View>
          )}
          <View style={styles.packShine} />
          <View style={styles.packContent}>
            <View style={styles.packIconContainer}>
              <DiamondPackSvg size={56} count={packSize} />
            </View>
            <View style={styles.packInfo}>
              <Text style={styles.packDiamonds}>{diamonds}</Text>
              <Text style={styles.packLabel}>Diamonds</Text>
            </View>
            <View style={styles.packPriceContainer}>
              <LinearGradient
                colors={['#66BB6A', '#43A047']}
                style={styles.priceButton}
              >
                <Text style={styles.priceText}>${cost.toFixed(2)}</Text>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}

function WatchAdCard({ onWatch }: { onWatch: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withSpring(0.9, KidsAnimations.pop),
      withSpring(1, KidsAnimations.spring)
    );
    onWatch();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View style={[styles.adCard, KidsShadows.medium]}>
        <LinearGradient
          colors={['#FFE082', '#FFD54F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.adGradient}
        >
          <View style={styles.adShine} />
          <View style={styles.adContent}>
            <View style={styles.adIconContainer}>
              <Feather name="play-circle" size={36} color="#FF7043" />
            </View>
            <View style={styles.adInfo}>
              <Text style={styles.adTitle}>Watch Ad</Text>
              <Text style={styles.adSubtitle}>Get FREE Diamond!</Text>
            </View>
            <View style={styles.adReward}>
              <DiamondPackSvg size={32} count="small" />
              <Text style={styles.adRewardText}>+1</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}

export function KidsDiamondShopModal({
  visible,
  onClose,
  onPurchase,
  onWatchAd,
}: KidsDiamondShopModalProps) {
  const diamondPacks: { diamonds: number; cost: number; popular: boolean; packSize: 'small' | 'medium' | 'large' | 'mega' }[] = [
    { diamonds: 10, cost: 0.99, popular: false, packSize: 'small' },
    { diamonds: 50, cost: 3.99, popular: true, packSize: 'medium' },
    { diamonds: 150, cost: 9.99, popular: false, packSize: 'large' },
    { diamonds: 500, cost: 24.99, popular: false, packSize: 'mega' },
  ];

  const handlePurchase = (diamonds: number, cost: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Purchase Diamonds',
      `Buy ${diamonds} diamonds for $${cost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy', onPress: () => onPurchase(diamonds, cost) },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View entering={SlideInUp.springify().damping(15)} style={styles.modalContainer}>
          <KidsPanel variant="blue" padding="none" style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <DiamondPackSvg size={32} count="medium" />
              </View>
              <Text style={styles.headerTitle}>Diamond Shop</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#37474F" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              <WatchAdCard onWatch={onWatchAd} />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>PACKS</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.packsGrid}>
                {diamondPacks.map((pack, index) => (
                  <PackCard
                    key={index}
                    diamonds={pack.diamonds}
                    cost={pack.cost}
                    popular={pack.popular}
                    packSize={pack.packSize}
                    onPurchase={() => handlePurchase(pack.diamonds, pack.cost)}
                  />
                ))}
              </View>
            </ScrollView>
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
    width: Math.min(SCREEN_WIDTH - 32, 380),
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  modal: {
    borderRadius: KidsRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: KidsSpacing.lg,
    paddingVertical: KidsSpacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...KidsShadows.soft,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'FredokaOne',
    fontSize: 22,
    color: '#37474F',
    marginLeft: KidsSpacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: KidsSpacing.md,
    paddingBottom: KidsSpacing.xl,
  },
  adCard: {
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
    marginBottom: KidsSpacing.md,
  },
  adGradient: {
    padding: KidsSpacing.md,
    borderRadius: KidsRadius.lg,
    borderWidth: 2,
    borderColor: '#FFB300',
    position: 'relative',
    overflow: 'hidden',
  },
  adShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  adIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...KidsShadows.soft,
  },
  adInfo: {
    flex: 1,
    marginLeft: KidsSpacing.sm,
  },
  adTitle: {
    fontFamily: 'FredokaOne',
    fontSize: 18,
    color: '#5D4037',
  },
  adSubtitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: '#795548',
  },
  adReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adRewardText: {
    fontFamily: 'FredokaOne',
    fontSize: 18,
    color: '#00838F',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: KidsSpacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(55, 71, 79, 0.15)',
    borderRadius: 1,
  },
  dividerText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#607D8B',
    marginHorizontal: KidsSpacing.sm,
  },
  packsGrid: {
    gap: KidsSpacing.sm,
  },
  packCardPressable: {
    marginBottom: KidsSpacing.xs,
  },
  packCard: {
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
  },
  packGradient: {
    padding: KidsSpacing.md,
    borderRadius: KidsRadius.lg,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: '#AB47BC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 2,
  },
  popularText: {
    fontFamily: 'FredokaOne',
    fontSize: 10,
    color: '#FFFFFF',
  },
  packShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
  },
  packContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  packIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: KidsRadius.md,
  },
  packInfo: {
    flex: 1,
    marginLeft: KidsSpacing.sm,
  },
  packDiamonds: {
    fontFamily: 'FredokaOne',
    fontSize: 24,
    color: '#00838F',
  },
  packLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#607D8B',
    marginTop: -2,
  },
  packPriceContainer: {
    ...KidsShadows.soft,
    borderRadius: KidsRadius.round,
    overflow: 'hidden',
  },
  priceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: KidsRadius.round,
  },
  priceText: {
    fontFamily: 'FredokaOne',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
