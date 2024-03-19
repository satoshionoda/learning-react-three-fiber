import { Button, Menu } from "@mantine/core";
import { View } from "@react-three/drei";
import { forwardRef } from "react";
import type { PropsWithChildren } from "react";
import { useStore } from "@/state.ts";

type Props = {} & PropsWithChildren;
export const MainPanel = forwardRef<HTMLDivElement, Props>(({ children, ...props }, fref) => {
  const projection = useStore((state) => state.projection);
  const setProjection = useStore((state) => state.setProjection);
  return (
    <div ref={fref} className="panel" style={{ gridArea: "main" }}>
      <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {children}
      </View>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button>{projection}</Button>
        </Menu.Target>
        <Menu.Dropdown onClick={(e) => setProjection((e.target as HTMLElement).innerText)}>
          <Menu.Item>Perspective</Menu.Item>
          <Menu.Item>Orthographic</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
});
