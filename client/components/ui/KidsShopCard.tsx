import React from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Circle, Text as SvgText } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { TinyTownColors, KidsShadows, KidsRadius, KidsSpacing, KidsAnimations } from '@/constants/kidsCartoonTheme';
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
          <Stop offset="0%" stopColor="#FFE082" />
          <Stop offset="50%" stopColor="#FFB84D" />
          <Stop offset="100%" stopColor="#F5A623" />
        </RadialGradient>
      </Defs>
      <Circle cx="20" cy="21" r="17" fill="#F5A623" />
      <Circle cx="20" cy="19" r="17" fill="url(#coinGrad)" />
      <Circle cx="20" cy="19" r="13" fill="#FFB84D" stroke="#F5A623" strokeWidth="1" />
      <SvgText x="20" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#F5A623">$</SvgText>
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
  const translateY = useSharedValue(0);
  const cost = getBuildingCost(building);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, KidsAnimations.pop);
    translateY.value = withTiming(2, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, KidsAnimations.spring);
    translateY.value = withTiming(0, { duration: 100 });
  };

  const handleBuy = () => {
    if (!isLocked && canAfford) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scale.value = withSequence(
        withSpring(0.92, KidsAnimations.pop),
        withSpring(1.04, KidsAnimations.bounce),
        withSpring(1, KidsAnimations.spring)
      );
      onBuy();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const tierColors = {
    common: { bg: TinyTownColors.success.light + '40', border: TinyTownColors.success.main, text: TinyTownColors.success.dark },
    rare: { bg: TinyTownColors.diamond.light + '40', border: TinyTownColors.diamond.main, text: TinyTownColors.diamond.dark },
    legendary: { bg: TinyTownColors.primary.light + '40', border: TinyTownColors.primary.main, text: TinyTownColors.primary.dark },
  };

  const tierConfig = tierColors[building.tier] || tierColors.common;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.cardPressable, animatedStyle]}
    >
      <View style={[styles.cardOuter, isLocked && styles.cardOuterLocked]}>
        <View style={[styles.card, KidsShadows.card]}>
          {isLocked && <View style={styles.lockedOverlay} />}
          <View style={styles.cardShine} />
          
          <View style={styles.cardContent}>
            <View style={styles.iconSection}>
              <View style={[
                styles.iconContainer, 
                { backgroundColor: tierConfig.bg, borderColor: tierConfig.border },
                isLocked && styles.iconContainerLocked
              ]}>
                <BuildingIcon type={building.iconType} tier={building.tier} size={65} />
                {isLocked && (
                  <View style={styles.lockIcon}>
                    <Feather name="lock" size={22} color="#FFFFFF" />
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
                  <View style={[styles.tierBadge, { backgroundColor: tierConfig.bg, borderColor: tierConfig.border }]}>
                    <Text style={styles.tierText}>
                      {building.tier === 'legendary' ? '⭐' : '💎'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.description, isLocked && styles.textLocked]} numberOfLines={2}>
                {building.description}
              </Text>
              <View style={styles.incomeRow}>
                <Feather name="trending-up" size={14} color={isLocked ? '#9E9E9E' : TinyTownColors.success.main} />
                <Text style={[styles.incomeText, isLocked && styles.textLocked]}>
                  +{formatNumber(building.baseIncome)}/sec
                </Text>
              </View>
            </View>

            <View style={styles.buySection}>
              <View style={styles.costRow}>
                <CoinSvg size={24} />
                <Text style={[styles.costText, { color: canAfford ? TinyTownColors.primary.main : '#EF5350' }]}>
                  {formatNumber(cost)}
                </Text>
              </View>
              <Pressable
                onPress={handleBuy}
                disabled={isLocked || !canAfford}
                style={({ pressed }) => [
                  styles.buyButtonOuter,
                  pressed && styles.buyButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={
                    isLocked
                      ? (['#BDBDBD', '#9E9E9E'] as const)
                      : canAfford
                      ? ([TinyTownColors.success.light, TinyTownColors.success.main] as const)
                      : (['#EF9A9A', '#EF5350'] as const)
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
                <View style={[
                  styles.buyButtonBottom,
                  { backgroundColor: isLocked ? '#757575' : canAfford ? TinyTownColors.success.dark : '#C62828' }
                ]} />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={[styles.cardBottom, isLocked && styles.cardBottomLocked]} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardPressable: {
    marginBottom: KidsSpacing.md,
  },
  cardOuter: {
    borderRadius: KidsRadius.lg,
    backgroundColor: '#E0E0E0',
  },
  cardOuterLocked: {
    backgroundColor: '#BDBDBD',
  },
  card: {
    borderRadius: KidsRadius.lg,
    backgroundColor: TinyTownColors.panel.white,
    padding: KidsSpacing.md,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(189, 189, 189, 0.1)',
    zIndex: 0,
    borderRadius: KidsRadius.lg,
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
    width: 78,
    height: 78,
    borderRadius: KidsRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    ...KidsShadows.soft,
  },
  iconContainerLocked: {
    backgroundColor: '#ECEFF1',
    borderColor: '#B0BEC5',
  },
  lockIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: KidsRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownedBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: TinyTownColors.success.main,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: KidsRadius.round,
    borderWidth: 2,
    borderColor: TinyTownColors.panel.white,
    ...KidsShadows.soft,
  },
  ownedText: {
    fontFamily: 'FredokaOne',
    fontSize: 12,
    color: '#FFFFFF',
  },
  infoSection: {
    flex: 1,
    marginLeft: KidsSpacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buildingName: {
    fontFamily: 'FredokaOne',
    fontSize: 16,
    color: TinyTownColors.text.primary,
    flex: 1,
  },
  textLocked: {
    color: '#9E9E9E',
  },
  tierBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  tierText: {
    fontSize: 11,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: TinyTownColors.text.secondary,
    marginTop: 3,
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
    color: TinyTownColors.success.main,
  },
  buySection: {
    alignItems: 'center',
    marginLeft: KidsSpacing.sm,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  costText: {
    fontFamily: 'FredokaOne',
    fontSize: 15,
  },
  buyButtonOuter: {
    borderRadius: KidsRadius.round,
    overflow: 'hidden',
  },
  buyButtonPressed: {
    transform: [{ scale: 0.95 }, { translateY: 2 }],
  },
  buyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: KidsRadius.round,
    position: 'relative',
    overflow: 'hidden',
  },
  buyButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: KidsRadius.round,
    borderTopRightRadius: KidsRadius.round,
  },
  buyButtonText: {
    fontFamily: 'FredokaOne',
    fontSize: 13,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buyButtonBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: KidsRadius.round,
    borderBottomRightRadius: KidsRadius.round,
  },
  cardBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderBottomLeftRadius: KidsRadius.lg,
    borderBottomRightRadius: KidsRadius.lg,
  },
  cardBottomLocked: {
    backgroundColor: '#BDBDBD',
  },
});
