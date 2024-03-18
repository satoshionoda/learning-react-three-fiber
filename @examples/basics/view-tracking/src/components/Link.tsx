import { View } from "@react-three/drei";
import { useRef, useState } from "react";
import type { FC, PointerEventHandler, PropsWithChildren } from "react";

type Props = {
  href: string;
  text: string;
} & PropsWithChildren;
export const Link: FC<Props> = ({ href, text, children }) => {
  const ref = useRef<HTMLElement>(null!);
  const [hovered, hover] = useState(false);
  const onPointerMove: PointerEventHandler<HTMLAnchorElement> = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY - (e.target as HTMLElement).offsetTop - 100;
    ref.current.style.transform = `translate3d(${x}px,${y}px,0)`;
  };
  return (
    <a
      href={href}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      onPointerMove={onPointerMove}
    >
      {text}
      <View
        ref={ref}
        visible={hovered}
        index={Infinity} // Render this view on top of all others
        className="view"
        style={{ position: "absolute", width: 200, display: "block", pointerEvents: "none" }}
      >
        <group>{children}</group>
      </View>
    </a>
  );
};
