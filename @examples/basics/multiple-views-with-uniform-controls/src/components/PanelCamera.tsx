import { OrthographicCamera } from "@react-three/drei";
import type { Positions } from "@/state.ts";
import type { FC } from "react";
import { useStore } from "@/state.ts";

const positions: Record<Positions, [number, number, number]> = {
  Top: [0, 10, 0],
  Bottom: [0, -10, 0],
  Left: [-10, 0, 0],
  Right: [10, 0, 0],
  Back: [0, 0, -10],
  Front: [0, 0, 10],
};

type Props = { which: "top" | "middle" | "bottom" };
export const PanelCamera: FC<Props> = ({ which }) => {
  const view = useStore((state) => state[which]);
  return <OrthographicCamera makeDefault position={positions[view]} zoom={100} />;
};
