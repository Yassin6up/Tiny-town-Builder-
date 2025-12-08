import React from "react";
import { CoinSvgIcon } from "./icons/CoinSvgIcon";

interface CoinIconProps {
  size?: number;
}

export function CoinIcon({ size = 24 }: CoinIconProps) {
  return <CoinSvgIcon size={size} />;
}
