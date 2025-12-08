import React from "react";
import { View, ViewStyle, Text, StyleSheet } from "react-native";
import { CartoonPanel } from "./CartoonPanel";
import { CartoonColors } from "@/constants/cartoonUI";

interface CardProps {
  elevation?: number;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'wood' | 'wood-dark' | 'wood-rich' | 'stone' | 'stone-dark' | 'gold' | 'gold-bronze';
}

export function Card({
  elevation = 1,
  title,
  description,
  children,
  onPress,
  style,
  variant = 'wood',
}: CardProps) {
  return (
    <CartoonPanel variant={variant} style={style}>
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
      {children}
    </CartoonPanel>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'FredokaOne',
    fontSize: 18,
    color: CartoonColors.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  description: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: CartoonColors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
});
