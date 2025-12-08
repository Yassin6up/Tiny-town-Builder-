import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Text,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { formatNumber } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { DiamondIcon } from "@/components/DiamondIcon";
import { SettingsSvgIcon } from "@/components/icons/SettingsSvgIcon";
import { DistrictBackground } from "@/components/DistrictBackground";
import { BuildingGrid } from "@/components/BuildingGrid";
import { OfflineEarningsModal } from "@/components/OfflineEarningsModal";
import { DiamondShopModal } from "@/components/DiamondShopModal";
import { BoostBanner } from "@/components/BoostBanner";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { IsometricBuildingGrid } from "@/components/IsometricBuildingGrid";
import { ParticleEffect } from "@/components/ParticleEffect";
import { useMusic } from "@/lib/MusicContext";
import { CartoonHeader } from "@/components/CartoonHeader";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TownScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { state, tapChest, getTapAmount, offlineEarnings, dismissOfflineEarnings, purchaseDiamonds, watchAdForDiamond } = useGame();
  const { initMusic, setMusicVolume } = useMusic();
  const [showDiamondShop, setShowDiamondShop] = React.useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  // Flying coin animation state
  const coinX = useSharedValue(0);
  const coinY = useSharedValue(0);
  const coinScale = useSharedValue(0);
  const coinOpacity = useSharedValue(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [showFlyingCoin, setShowFlyingCoin] = useState(false);

  const chestScale = useSharedValue(1);
  const chestRotation = useSharedValue(0);
  const coinBurstOpacity = useSharedValue(0);
  const coinBurstY = useSharedValue(0);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    console.log('showFlyingCoin changed:', showFlyingCoin, 'amount:', coinAmount);
  }, [showFlyingCoin, coinAmount]);

  const animatedCoinStyle = useAnimatedStyle(() => {
    return {
      left: coinX.value,
      top: coinY.value,
      transform: [
        { scale: coinScale.value },
      ],
      opacity: coinOpacity.value,
    };
  });
  const loadingOpacity = useSharedValue(1);

  const currentDistrict = state.districts.find(d => d.id === state.currentDistrict);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoadingProgress(10);
        
        // Start music early (streaming mode - plays while loading)
        try {
          await initMusic();
        } catch (e) {
          console.log('Music initialization skipped:', e);
        }
        setLoadingProgress(20);
        
        // Preload background images
        const backgroundAssets = [
          Image.prefetch(Image.resolveAssetSource(require('../../assets/images/backgrounds/forest.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/images/backgrounds/coastal.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/images/backgrounds/mountain peak.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/images/backgrounds/dissert.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/images/backgrounds/skycity.png')).uri),
        ];
        
        await Promise.all(backgroundAssets);
        setLoadingProgress(30);
        
        // Preload building images
        const buildingAssets = [
          Image.prefetch(Image.resolveAssetSource(require('../../assets/images/icon.png')).uri),
          // Forest buildings
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/forest map/house.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/forest map/breed house.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/forest map/windmill.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/forest map/bee house.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/forest map/tree house.png')).uri),
          // Coastal buildings
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/coastal map/Lighthouse.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/coastal map/fishmarket.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/coastal map/boatrepair.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/coastal map/RoyalShipyard.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/coastal map/CrystalMarina.png')).uri),
          // Mountain buildings
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/montain map/MountainTavern.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/montain map/StarObservatory.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/montain map/AlpineCafe.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/montain map/CozySkiLodge.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/montain map/IceCrystalPalace.png')).uri),
          // Desert buildings
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/disser map/AncientPyramid.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/disser map/OasisWell.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/disser map/CactusFarm.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/disser map/ExoticBazaar.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/disser map/sultan.png')).uri),
          // City buildings
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/city map/GlassTower.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/city map/GrandFountain.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/city map/hotel.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/city map/skyGarden.png')).uri),
          Image.prefetch(Image.resolveAssetSource(require('../../assets/model/city map/diamondhouse.png')).uri),
        ];
        
        await Promise.all(buildingAssets);
        setLoadingProgress(60);
        
        // Preload sound
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/click.mp3'),
            { shouldPlay: false }
          );
          await sound.unloadAsync();
        } catch (e) {
          console.log('Sound preload skipped:', e);
        }
        
        setLoadingProgress(85);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setLoadingProgress(95);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Fade out loading screen
        loadingOpacity.value = withTiming(0, { duration: 400 }, () => {
          runOnJS(setIsLoading)(false);
        });
      } catch (error) {
        console.log('Loading error:', error);
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  // Manage music volume - full volume on TownScreen
  useEffect(() => {
    setMusicVolume(0.5); // Normal volume when on TownScreen
    
    return () => {
      // Lower volume when leaving TownScreen
      setMusicVolume(0.2);
    };
  }, [setMusicVolume]);

  // Lower music volume when modals open
  useEffect(() => {
    if (showDiamondShop || offlineEarnings !== null) {
      setMusicVolume(0.2); // Lower volume
    } else {
      setMusicVolume(0.5); // Normal volume
    }
  }, [showDiamondShop, offlineEarnings, setMusicVolume]);

  const handleTapChest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Play coin sound effect
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/click.mp3'),
        { shouldPlay: true }
      );
      // Unload sound after playing to free memory
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Sound play error:', error);
    }
    
    // Super bouncy cartoon scale animation
    chestScale.value = withSequence(
      withSpring(0.75, { damping: 8, stiffness: 300 }),
      withSpring(1.15, { damping: 5, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 250 })
    );
    
    // Exaggerated wiggle animation
    chestRotation.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 120 }),
      withTiming(-5, { duration: 80 }),
      withTiming(0, { duration: 60 })
    );

    coinBurstOpacity.value = 1;
    coinBurstY.value = 0;
    coinBurstOpacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
    coinBurstY.value = withTiming(-60, { duration: 600, easing: Easing.out(Easing.ease) });

    // Trigger Lottie coin animation
    setShowCoinAnimation(true);
    lottieRef.current?.play();
    setTimeout(() => setShowCoinAnimation(false), 1500);

    tapChest();
  };

  const chestAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: chestScale.value },
      { rotate: `${chestRotation.value}deg` },
    ],
  }));

  const coinBurstStyle = useAnimatedStyle(() => ({
    opacity: coinBurstOpacity.value,
    transform: [{ translateY: coinBurstY.value }],
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  // Dynamic background based on district
  const backgroundImages = {
    forest: require('../../assets/images/backgrounds/forest.png'),
    coastal: require('../../assets/images/backgrounds/coastal.png'),
    mountain: require('../../assets/images/backgrounds/mountain peak.png'),
    desert: require('../../assets/images/backgrounds/dissert.png'),
    skyline: require('../../assets/images/backgrounds/skycity.png'),
  };

  const districtLogos = {
    forest: require('../../assets/images/districtLogo/forest.png'),
    coastal: require('../../assets/images/districtLogo/coastal.png'),
    mountain: require('../../assets/images/districtLogo/mountain.png'),
    desert: require('../../assets/images/districtLogo/dissert.png'),
    skyline: require('../../assets/images/districtLogo/city.png'),
  };

  if (isLoading) {
    return (
      <Animated.View style={[styles.loadingContainer, loadingAnimatedStyle]}>
        <Image
          source={require('../../assets/images/splash.png')}
          style={styles.loadingBackgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#E8F4FD" }]}>
      {/* Dynamic Background Image */}
      <Image
        source={backgroundImages[state.currentDistrict]}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Full Screen Scrollable Building Area */}
      <Animated.ScrollView
        style={styles.buildingArea}
        contentContainerStyle={{
          paddingTop: insets.top + 80,
          paddingBottom: tabBarHeight + 140,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={state.buildings.filter(b => b.districtId === state.currentDistrict && b.owned > 0).length > 4}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Enhanced Isometric Building Grid */}
        <IsometricBuildingGrid 
          districtId={state.currentDistrict}
          onCoinCollect={(x, y, amount) => {
            console.log('onCoinCollect called:', { x, y, amount });
            coinX.value = x;
            coinY.value = y;
            coinScale.value = 0;
            coinOpacity.value = 0;
            setCoinAmount(amount);
            setShowFlyingCoin(true);
            console.log('showFlyingCoin set to true');
            
            // Phase 1: Fade in and bounce
            coinOpacity.value = withTiming(1, { duration: 300 });
            coinScale.value = withSequence(
              withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
              withDelay(200, withTiming(1, { duration: 200 }))
            );
            
            // Phase 2: Fly to top
            const targetX = SCREEN_WIDTH / 2 - 20;
            const targetY = insets.top + 100; // Adjusted to coin header position
            console.log('Animation targets:', { targetX, targetY, fromX: x, fromY: y });
            coinX.value = withDelay(500, withTiming(targetX, { duration: 1000, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }));
            coinY.value = withDelay(500, withTiming(targetY, { duration: 1000, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }));
            coinScale.value = withDelay(500, withTiming(0.6, { duration: 1000, easing: Easing.out(Easing.ease) }));
            
            // Phase 3: Fade out
            coinOpacity.value = withDelay(1200, withTiming(0, { duration: 300 }, (finished) => {
              if (finished) {
                runOnJS(setShowFlyingCoin)(false);
              }
            }));
          }}
        />
      </Animated.ScrollView>

      {/* Cartoon Header with Currency */}
      <View style={[styles.absoluteHeader, { paddingTop: insets.top + Spacing.sm }]}>
        <CartoonHeader
          coins={state.coins}
          diamonds={state.diamonds}
          districtLogo={districtLogos[state.currentDistrict]}
          onDistrictPress={() => navigation.navigate("DistrictSelector")}
          onDiamondPress={() => setShowDiamondShop(true)}
          onSettingsPress={() => navigation.navigate("Settings")}
        />
      </View>

      <View style={[styles.chestContainer, { bottom: tabBarHeight + Spacing.xl + 10 }]}>
        {/* Lottie Coin Animation */}
        {showCoinAnimation && (
          <View style={styles.lottieContainer} pointerEvents="none">
            <LottieView
              ref={lottieRef}
              source={require('../../assets/animations/coins effect.json')}
              style={styles.lottieAnimation}
              autoPlay={false}
              loop={false}
            />
          </View>
        )}
        
        {/* Coin particle effect on chest */}
        <View style={styles.chestParticles} pointerEvents="none">
          <ParticleEffect type="coins" active={state.tapCount > 0} count={3} />
        </View>
        
        <AnimatedPressable
          onPress={handleTapChest}
          style={[styles.chestButton, chestAnimatedStyle]}
        >
          <Animated.View style={[styles.coinBurst, coinBurstStyle]}>
            <ThemedText style={styles.coinBurstText}>+{getTapAmount()}</ThemedText>
          </Animated.View>
          <View style={styles.chestGlow} />
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.chestImage}
            resizeMode="contain"
          />
        </AnimatedPressable>
        <View style={styles.tapHintContainer}>
          <ThemedText style={styles.tapHint}>Tap for +{getTapAmount()} coins!</ThemedText>
        </View>
      </View>

      {/* Flying Coin Animation - Rendered at root level */}
      {showFlyingCoin && (
        <Animated.View style={[styles.flyingCoin, animatedCoinStyle]} pointerEvents="none">
          <View style={{ backgroundColor: 'rgba(255,0,0,0.5)', padding: 10 }}>
            <CoinIcon size={40} />
            <Text style={styles.flyingCoinText}>+{formatNumber(coinAmount)}</Text>
          </View>
        </Animated.View>
      )}

      <OfflineEarningsModal
        visible={offlineEarnings > 0}
        earnings={offlineEarnings}
        onDismiss={dismissOfflineEarnings}
      />
      
      <DiamondShopModal
        visible={showDiamondShop}
        onClose={() => setShowDiamondShop(false)}
        onPurchase={(diamonds, cost) => {
          // In a real app, this would trigger in-app purchase
          purchaseDiamonds(diamonds);
          setShowDiamondShop(false);
          Alert.alert("Success!", `You received ${diamonds} diamonds!`);
        }}
        onWatchAd={() => {
          // In a real app, this would show a rewarded video ad
          watchAdForDiamond();
          setShowDiamondShop(false);
          Alert.alert("Thanks for watching!", "You received 1 diamond!");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  absoluteHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    zIndex: 10,
  },
  districtSelector: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  districtLogo: {
    width: '100%',
    height: '100%',
  },
  districtBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    backgroundColor: "#FF6B9D",
    paddingHorizontal: Spacing.md + 6,
    paddingVertical: Spacing.sm + 6,
    borderRadius: BorderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  districtName: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#FFFFFF",
    textShadowColor: "#FF1493",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  currencyContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  coinDisplay: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  coinDisplayInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "#FFF9E6",
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  coinText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#FF9800",
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  diamondDisplay: {
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  diamondDisplayInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "#E6F7FF",
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: "#00E5FF",
  },
  diamondText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: "#00B8D4",
    textShadowColor: "#00E5FF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6f8fa0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  settingsIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#00C9FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  incomeDisplay: {
    position: "absolute",
    top: 110,
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    backgroundColor: "#00E676",
    paddingHorizontal: Spacing.md + 6,
    paddingVertical: Spacing.sm + 6,
    borderRadius: BorderRadius.full,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  incomeText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: "#FFFFFF",
    textShadowColor: "#00C853",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buildingArea: {
    flex: 1,
  },
  chestContainer: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 20,
  },
  lottieContainer: {
    position: "absolute",
    top: -150,
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 25,
  },
  lottieAnimation: {
    width: "100%",
    height: "100%",
  },
  chestParticles: {
    position: "absolute",
    top: -30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  chestButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFD93D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 6,
    borderColor: "#FFFFFF",
    transform: [{ scale: 1.05 }],
  },
  chestGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFE66D",
    opacity: 0.4,
  },
  chestImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },
  coinBurst: {
    position: "absolute",
    top: -25,
  },
  coinBurstText: {
    fontFamily: "FredokaOne",
    fontSize: 28,
    color: "#FFD700",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tapHintContainer: {
    marginTop: Spacing.sm + 2,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.xs + 4,
    borderRadius: BorderRadius.full,
    shadowColor: "#FF9F43",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#FFE066",
  },
  tapHint: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#FF9F43",
    textShadowColor: "#FFE066",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  loadingBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  loadingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 6,
    borderColor: "#FF6B9D",
  },
  loadingTitle: {
    fontFamily: "FredokaOne",
    fontSize: 36,
    color: "#2D3748",
    marginBottom: 10,
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  loadingSubtitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#718096",
    marginBottom: 30,
  },
  progressBarContainer: {
    width: 250,
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF6B9D",
    borderRadius: 20,
  },
  flyingCoin: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
    pointerEvents: "none",
  },
  flyingCoinText: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: "#FFD700",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginTop: 4,
  },
});

