import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { CartoonColors, CartoonShadows, CartoonRadius, CartoonSpacing } from '@/constants/cartoonUI';
import { WoodTextureSvg, GoldTextureSvg, StoneTextureSvg } from '@/components/textures';
import { CartoonCoinIcon, CartoonDiamondIcon } from './CartoonCurrency';
import { BounceIn, Floating, PopIn } from './CartoonAnimations';
import { formatNumber } from '@/lib/gameData';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle } from 'react-native-svg';

interface CartoonHeaderProps {
  coins: number;
  diamonds: number;
  districtLogo: any;
  onDistrictPress: () => void;
  onDiamondPress: () => void;
  onSettingsPress: () => void;
  style?: any;
}

export function CartoonHeader({
  coins,
  diamonds,
  districtLogo,
  onDistrictPress,
  onDiamondPress,
  onSettingsPress,
  style,
}: CartoonHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {/* District Selector - Left Side */}
      <BounceIn delay={100}>
        <Pressable 
          style={styles.districtButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDistrictPress();
          }}
        >
          <View style={styles.districtBorder}>
            {/* Gold SVG Texture Background */}
            <View style={styles.textureBackground}>
              <GoldTextureSvg width={60} height={60} variant="bright" borderRadius={12} />
            </View>
            <Image source={districtLogo} style={styles.districtLogo} resizeMode="cover" />
            <View style={styles.districtShine} />
          </View>
        </Pressable>
      </BounceIn>

      {/* Currency Container - Right Side */}
      <View style={styles.currencyGroup}>
        {/* Coins Display */}
        <BounceIn delay={200}>
          <Floating distance={5} duration={2000}>
            <View style={styles.currencyButton}>
              <View style={styles.currencyBorder}>
                {/* Wood SVG Texture Background */}
                <View style={styles.textureBackground}>
                  <WoodTextureSvg width={120} height={40} variant="light" borderRadius={20} />
                </View>
                <View style={styles.currencyHighlight} />
                <View style={styles.currencyContent}>
                  <CartoonCoinIcon size={26} />
                  <Text style={styles.currencyText}>{formatNumber(coins)}</Text>
                </View>
              </View>
            </View>
          </Floating>
        </BounceIn>

        {/* Diamonds Display with Plus Button */}
        <BounceIn delay={300}>
          <Floating distance={5} duration={2500}>
            <Pressable 
              style={styles.currencyButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onDiamondPress();
              }}
            >
              <View style={styles.currencyBorder}>
                {/* Wood SVG Texture Background */}
                <View style={styles.textureBackground}>
                  <WoodTextureSvg width={140} height={40} variant="rich" borderRadius={20} />
                </View>
                <View style={styles.currencyHighlight} />
                <View style={styles.currencyContent}>
                  <CartoonDiamondIcon size={24} />
                  <Text style={styles.currencyText}>{formatNumber(diamonds)}</Text>
                  <View style={styles.plusButton}>
                    <Svg width={16} height={16} viewBox="0 0 24 24">
                      <Path
                        d="M12 5 L12 19 M5 12 L19 12"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </View>
                </View>
              </View>
            </Pressable>
          </Floating>
        </BounceIn>

        {/* Settings Button */}
        <BounceIn delay={400}>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSettingsPress();
            }}
          >
            <View style={styles.settingsBorder}>
              {/* Stone SVG Texture Background */}
              <View style={styles.textureBackground}>
                <StoneTextureSvg width={50} height={50} variant="gray" borderRadius={25} />
              </View>
              <View style={styles.settingsHighlight} />
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Path
                  d="M12 8 A4 4 0 0 1 12 16 A4 4 0 0 1 12 8 Z M12 1 L12 4 M12 20 L12 23 M4 12 L1 12 M23 12 L20 12 M6 6 L4 4 M20 4 L18 6 M18 18 L20 20 M4 20 L6 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </Pressable>
        </BounceIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CartoonSpacing.md,
    paddingVertical: CartoonSpacing.sm,
    zIndex: 1000,
  },
  districtButton: {
    ...CartoonShadows.large,
  },
  districtBorder: {
    width: 60,
    height: 60,
    borderRadius: CartoonRadius.medium,
    borderWidth: 3,
    borderColor: CartoonColors.gold.dark,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textureBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  districtLogo: {
    width: '80%',
    height: '80%',
    zIndex: 1,
  },
  districtShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: CartoonRadius.medium,
    borderTopRightRadius: CartoonRadius.medium,
    zIndex: 2,
  },
  currencyGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  currencyButton: {
    ...CartoonShadows.medium,
  },
  currencyBorder: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: CartoonColors.wood.shadow,
    overflow: 'hidden',
    position: 'relative',
  },
  currencyHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 2,
  },
  currencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 3,
    position: 'relative',
  },
  currencyText: {
    fontFamily: 'FredokaOne',
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  plusButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  settingsButton: {
    ...CartoonShadows.medium,
  },
  settingsBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: CartoonColors.stone.shadow,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    zIndex: 2,
  },
});
