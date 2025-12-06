import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface CoinIconProps {
  size?: number;
}

export function CoinIcon({ size = 24 }: CoinIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Feather name="dollar-sign" size={size * 0.6} color={Colors.light.darkWood} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.gold,
    justifyContent: "center",
    alignItems: "center",
  },
});
