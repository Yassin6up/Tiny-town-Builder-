import React from "react";
import { DiamondSvgIcon } from "./icons/DiamondSvgIcon";

interface DiamondIconProps {
  size?: number;
}

export function DiamondIcon({ size = 24 }: DiamondIconProps) {
  return <DiamondSvgIcon size={size} />;
}
