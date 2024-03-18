import { Billboard, type BillboardProps, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Color } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import type { MeshBasicMaterial } from "three";

type Props = PropsWithChildren<{} & BillboardProps>;
const fontProps = {
  font: "/Inter-Bold.woff",
  fontSize: 2.5,
  letterSpacing: -0.05,
  lineHeight: 1,
  "material-toneMapped": false,
};
export const Word: FC<Props> = ({ children, ...props }) => {
  const color = new Color();
  const ref = useRef<ComponentProps<typeof Text>>(null!);
  const [hovered, setHovered] = useState(false);
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };
  const out = () => setHovered(false);
  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);
  useFrame(() => {
    const material = ref.current.material as MeshBasicMaterial;
    material.color.lerp(color.set(hovered ? "#fa2720" : "white"), 0.1);
  });

  return (
    <Billboard {...props}>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        onClick={() => console.log("clicked")}
        {...fontProps}
        children={children}
      />
    </Billboard>
  );
};
