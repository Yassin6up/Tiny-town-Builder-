import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TownScreen from "@/screens/TownScreen";
import ShopScreen from "@/screens/ShopScreen";
import StatsScreen from "@/screens/StatsScreen";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
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
        tabBarActiveTintColor: "#FF6B9D",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#FFFFFF",
          borderTopWidth: 5,
          borderTopColor: "#D4E9F7",
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom + 12,
          paddingTop: 14,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
        },
        tabBarLabelStyle: {
          fontFamily: "Nunito-Bold",
          fontSize: 12,
          fontWeight: "700",
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
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Feather name="home" size={focused ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopScreen}
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.shopIconContainer,
                {
                  backgroundColor: focused ? "#00E676" : "#E8F4FD",
                  transform: [{ scale: focused ? 1.15 : 1 }],
                },
              ]}
            >
              <ShopSvgIcon size={focused ? 44 : 40} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <StatisticSvgIcon size={focused ? 38 : 34} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconWrapperActive: {
    backgroundColor: "#FFE8F0",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  shopIconContainer: {
    width: 75,
    height: 75,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 5,
    borderColor: "#FFFFFF",
  },
});
