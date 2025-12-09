import React from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { KidsColors, KidsShadows, KidsRadius, KidsSpacing, KidsAnimations } from '@/constants/kidsCartoonTheme';
import { Building, formatNumber, getBuildingCost } from '@/lib/gameData';
import { BuildingIcon } from '@/components/BuildingIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsShopCardProps {
  building: Building;
  isLocked: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onPress: () => void;
}

function CoinSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="coinGrad" cx="35%" cy="35%" r="60%">
          <Stop offset="0%" stopColor="#FFEB3B" />
          <Stop offset="50%" stopColor="#FFD700" />
          <Stop offset="100%" stopColor="#FFA000" />
        </RadialGradient>
      </Defs>
      <Circle cx="20" cy="20" r="18" fill="url(#coinGrad)" />
      <Circle cx="20" cy="20" r="14" fill="#FFC107" stroke="#FFB300" strokeWidth="1" />
    </Svg>
  );
}

export function KidsShopCard({
  building,
  isLocked,
  canAfford,
  onBuy,
  onPress,
}: KidsShopCardProps) {
  const scale = useSharedValue(1);
  const cost = getBuildingCost(building);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, KidsAnimations.pop);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, KidsAnimations.spring);
  };

  const handleBuy = () => {
    if (!isLocked && canAfford) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scale.value = withSequence(
        withSpring(0.9, KidsAnimations.pop),
        withSpring(1.05, KidsAnimations.bounce),
        withSpring(1, KidsAnimations.spring)
      );
      onBuy();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const cardGradient = isLocked
    ? (['#ECEFF1', '#CFD8DC'] as const)
    : (['#FFFFFF', '#F5F5F5'] as const);

  const borderColor = isLocked ? '#90A4AE' : '#E0E0E0';

  const tierColors = {
    common: { bg: '#E8F5E9', text: '#43A047' },
    rare: { bg: '#E3F2FD', text: '#1976D2' },
    legendary: { bg: '#FFF8E1', text: '#F57C00' },
  };

  const tierConfig = tierColors[building.tier] || tierColors.common;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.cardPressable, animatedStyle]}
    >
      <View style={[styles.card, KidsShadows.medium]}>
        <LinearGradient
          colors={cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.cardGradient, { borderColor }]}
        >
          {isLocked && <View style={styles.lockedOverlay} />}
          <View style={styles.cardShine} />
          
          <View style={styles.cardContent}>
            <View style={styles.iconSection}>
              <View style={[styles.iconContainer, isLocked && styles.iconContainerLocked]}>
                <BuildingIcon type={building.iconType} tier={building.tier} size={70} />
                {isLocked && (
                  <View style={styles.lockIcon}>
                    <Feather name="lock" size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>
              {building.owned > 0 && (
                <View style={styles.ownedBadge}>
                  <Text style={styles.ownedText}>x{building.owned}</Text>
                </View>
              )}
            </View>

            <View style={styles.infoSection}>
              <View style={styles.nameRow}>
                <Text style={[styles.buildingName, isLocked && styles.textLocked]} numberOfLines={1}>
                  {building.name}
                </Text>
                {building.tier !== 'common' && (
                  <View style={[styles.tierBadge, { backgroundColor: tierConfig.bg }]}>
                    <Text style={[styles.tierText, { color: tierConfig.text }]}>
                      {building.tier === 'legendary' ? '⭐' : '💎'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.description, isLocked && styles.textLocked]} numberOfLines={2}>
                {building.description}
              </Text>
              <View style={styles.incomeRow}>
                <Feather name="trending-up" size={14} color={isLocked ? '#90A4AE' : '#66BB6A'} />
                <Text style={[styles.incomeText, isLocked && styles.textLocked]}>
                  +{formatNumber(building.baseIncome)}/sec
                </Text>
              </View>
            </View>

            <View style={styles.buySection}>
              <View style={styles.costRow}>
                <CoinSvg size={22} />
                <Text style={[styles.costText, { color: canAfford ? '#FFA726' : '#EF5350' }]}>
                  {formatNumber(cost)}
                </Text>
              </View>
              <Pressable
                onPress={handleBuy}
                disabled={isLocked || !canAfford}
                style={({ pressed }) => [
                  styles.buyButton,
                  pressed && styles.buyButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={
                    isLocked
                      ? (['#90A4AE', '#78909C'] as const)
                      : canAfford
                      ? (['#66BB6A', '#43A047'] as const)
                      : (['#E57373', '#EF5350'] as const)
                  }
                  style={styles.buyButtonGradient}
                >
                  <View style={styles.buyButtonShine} />
                  <Feather
                    name={isLocked ? 'lock' : 'shopping-cart'}
                    size={14}
                    color="#FFFFFF"
                  />
                  <Text style={styles.buyButtonText}>
                    {isLocked ? 'Locked' : 'Buy'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardPressable: {
    marginBottom: KidsSpacing.md,
  },
  card: {
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: KidsRadius.lg,
    borderWidth: 2,
    padding: KidsSpacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(158, 158, 158, 0.15)',
    zIndex: 0,
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
    zIndex: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  iconSection: {
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: KidsRadius.md,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A5D6A7',
    ...KidsShadows.soft,
  },
  iconContainerLocked: {
    backgroundColor: '#ECEFF1',
    borderColor: '#B0BEC5',
  },
  lockIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: KidsRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownedBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#66BB6A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: KidsRadius.round,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...KidsShadows.soft,
  },
  ownedText: {
    fontFamily: 'FredokaOne',
    fontSize: 12,
    color: '#FFFFFF',
  },
  infoSection: {
    flex: 1,
    marginLeft: KidsSpacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buildingName: {
    fontFamily: 'FredokaOne',
    fontSize: 16,
    color: '#37474F',
    flex: 1,
  },
  textLocked: {
    color: '#90A4AE',
  },
  tierBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierText: {
    fontSize: 10,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#607D8B',
    marginTop: 2,
    lineHeight: 16,
  },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  incomeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#66BB6A',
  },
  buySection: {
    alignItems: 'center',
    marginLeft: KidsSpacing.sm,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  costText: {
    fontFamily: 'FredokaOne',
    fontSize: 14,
  },
  buyButton: {
    borderRadius: KidsRadius.round,
    overflow: 'hidden',
    ...KidsShadows.soft,
  },
  buyButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  buyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: KidsRadius.round,
    position: 'relative',
    overflow: 'hidden',
  },
  buyButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: KidsRadius.round,
    borderTopRightRadius: KidsRadius.round,
  },
  buyButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
