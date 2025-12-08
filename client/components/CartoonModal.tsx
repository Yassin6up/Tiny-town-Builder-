import React from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { CartoonPanel } from "./CartoonPanel";
import { CartoonButton } from "./CartoonButton";
import { BounceIn } from "./CartoonAnimations";
import { CartoonColors, CartoonSpacing, CartoonRadius } from "@/constants/cartoonUI";

interface CartoonModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export function CartoonModal({
  visible,
  title = "⭐ Upgrade Complete ⭐",
  message = "You earned +15 coins/s!",
  confirmLabel = "OKAY!",
  onClose,
  children,
}: CartoonModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <BounceIn>
          <CartoonPanel variant="wood" style={styles.panel}>
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              {children}
              <CartoonButton
                title={confirmLabel}
                onPress={onClose}
                variant="wood-rich"
                size="medium"
                style={styles.button}
              />
            </View>
          </CartoonPanel>
        </BounceIn>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: CartoonSpacing.lg,
  },
  panel: {
    width: 320,
    padding: CartoonSpacing.lg,
    borderRadius: CartoonRadius.large,
  },
  content: {
    alignItems: "center",
    gap: CartoonSpacing.sm,
  },
  title: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: CartoonColors.white,
    textShadowColor: "#000",
    textShadowRadius: 4,
  },
  message: {
    marginTop: CartoonSpacing.xs,
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: CartoonColors.white,
    textAlign: "center",
  },
  button: {
    marginTop: CartoonSpacing.md,
    width: "100%",
  },
});
