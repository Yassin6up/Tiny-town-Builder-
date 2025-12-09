import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Platform, StyleSheet, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import TownScreen from "@/screens/TownScreen";
import ShopScreen from "@/screens/ShopScreen";
import StatsScreen from "@/screens/StatsScreen";
import { useTheme } from "@/hooks/useTheme";
import { TinyTownColors, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
import { ShopSvgIcon } from "@/components/icons/ShopSvgIcon";
import { StatisticSvgIcon } from "@/components/icons/StatisticSvgIcon";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type MainTabParamList = {
  TownTab: undefined;
  ShopTab: undefined;
  StatsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function AnimatedTabIcon({ children, focused }: { children: React.ReactNode; focused: boolean }) {
  const scale = useSharedValue(focused ? 1.1 : 1);
  const translateY = useSharedValue(focused ? -4 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 12, stiffness: 200 });
    translateY.value = withSpring(focused ? -4 : 0, { damping: 12, stiffness: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

function ShopTabIcon({ focused }: { focused: boolean }) {
  const scale = useSharedValue(1);
  const bounce = useSharedValue(0);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 10, stiffness: 200 });
      bounce.value = withRepeat(
        withTiming(-3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      bounce.value = withTiming(0, { duration: 200 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: bounce.value },
    ],
  }));

  const gradientColors = focused 
    ? [TinyTownColors.success.light, TinyTownColors.success.main] as const
    : [TinyTownColors.panel.white, '#F5F5F5'] as const;

  const borderColor = focused ? TinyTownColors.success.dark : '#E0E0E0';
  const bottomColor = focused ? TinyTownColors.success.dark : '#BDBDBD';

  return (
    <Animated.View style={[styles.shopIconContainer, animatedStyle]}>
      <View style={[styles.shopIconOuter, { borderColor: bottomColor }]}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.shopIconGradient, { borderColor }]}
        >
          <View style={styles.shopIconShine} />
          <ShopSvgIcon size={focused ? 42 : 38} />
        </LinearGradient>
        <View style={[styles.shopIconBottom, { backgroundColor: bottomColor }]} />
      </View>
    </Animated.View>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="TownTab"
      screenOptions={{
        tabBarActiveTintColor: TinyTownColors.pink.main,
        tabBarInactiveTintColor: TinyTownColors.text.muted,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: TinyTownColors.panel.white,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          marginHorizontal: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "FredokaOne",
          fontSize: 11,
          marginTop: -2,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="TownTab"
        component={TownScreen}
        options={{
          title: "Town",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Feather name="home" size={focused ? 26 : 23} color={color} />
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopScreen}
        options={{
          title: "Shop",
          tabBarIcon: ({ focused }) => <ShopTabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <StatisticSvgIcon size={focused ? 34 : 30} />
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconWrapperActive: {
    backgroundColor: TinyTownColors.pink.light + '30',
  },
  shopIconContainer: {
    marginTop: -30,
  },
  shopIconOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: TinyTownColors.panel.white,
    ...KidsShadows.float,
  },
  shopIconGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    borderWidth: 3,
    position: "relative",
    overflow: "hidden",
  },
  shopIconShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  shopIconBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
});
