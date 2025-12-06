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
        tabBarActiveTintColor: theme.sage,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundDefault,
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: "Nunito",
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TownTab"
        component={TownScreen}
        options={{
          title: "Town",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
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
                  backgroundColor: focused ? theme.sage : theme.backgroundSecondary,
                },
              ]}
            >
              <Feather
                name="shopping-bag"
                size={size + 4}
                color={focused ? Colors.light.warmWhite : color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shopIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -Spacing.lg,
  },
});
