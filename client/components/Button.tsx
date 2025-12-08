import React, { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { CartoonButton } from "./CartoonButton";

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: 'wood' | 'wood-dark' | 'wood-rich' | 'stone' | 'stone-dark' | 'gold' | 'gold-bronze';
}

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = 'wood',
}: ButtonProps) {
  // Convert children to string for CartoonButton title
  const title = typeof children === 'string' ? children : String(children);
  
  return (
    <CartoonButton
      title={title}
      onPress={onPress || (() => {})}
      variant={variant}
      disabled={disabled}
      style={style as any}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "600",
  },
});
