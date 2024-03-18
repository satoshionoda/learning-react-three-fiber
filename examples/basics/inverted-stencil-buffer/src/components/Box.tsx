import { RoundedBox } from "@react-three/drei";
import type { FC } from "react";

type Props = {
  args?: [number, number, number];
  radius?: number;
  smoothness?: number;
  color?: string;
} & Omit<JSX.IntrinsicElements["mesh"], "args">;
export const Box: FC<Props> = ({
  args = [1, 4, 1],
  radius = 0.05,
  smoothness = 4,
  color = "black",
  ...boxProps
}) => (
  <RoundedBox args={args} radius={radius} smoothness={smoothness} {...boxProps}>
    <meshPhongMaterial color={color} />
  </RoundedBox>
);
