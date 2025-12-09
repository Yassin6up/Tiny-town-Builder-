import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import TownScreen from "@/screens/TownScreen";
import ShopScreen from "@/screens/ShopScreen";
import StatsScreen from "@/screens/StatsScreen";
import { useTheme } from "@/hooks/useTheme";
import { KidsColors, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
import { ShopSvgIcon } from "@/components/icons/ShopSvgIcon";
import { StatisticSvgIcon } from "@/components/icons/StatisticSvgIcon";

export type MainTabParamList = {
  TownTab: undefined;
  ShopTab: undefined;
  StatsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="TownTab"
      screenOptions={{
        tabBarActiveTintColor: KidsColors.bubblegumPink,
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          height: 85 + insets.bottom,
          paddingBottom: insets.bottom + 12,
          paddingTop: 16,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        },
        tabBarLabelStyle: {
          fontFamily: "FredokaOne",
          fontSize: 12,
          marginTop: -4,
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
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Feather name="home" size={focused ? 26 : 22} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopScreen}
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.shopIconContainer, focused && styles.shopIconActive]}>
              <LinearGradient
                colors={focused ? ['#00E676', '#00C853'] : ['#E3F2FD', '#BBDEFB']}
                style={styles.shopIconGradient}
              >
                <ShopSvgIcon size={focused ? 44 : 40} />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <StatisticSvgIcon size={focused ? 36 : 32} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconWrapperActive: {
    backgroundColor: "#FFF0F5",
    ...KidsShadows.soft,
  },
  shopIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginTop: -28,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    ...KidsShadows.medium,
  },
  shopIconActive: {
    transform: [{ scale: 1.1 }],
  },
  shopIconGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
