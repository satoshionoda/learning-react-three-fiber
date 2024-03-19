import { Button, Menu } from "@mantine/core";
import { View } from "@react-three/drei";
import { forwardRef } from "react";
import type { PropsWithChildren } from "react";
import { useStore } from "@/state.ts";

type Props = { which: "top" | "middle" | "bottom" } & PropsWithChildren;
export const SidePanel = forwardRef<HTMLDivElement, Props>(({ which, children }, fref) => {
  const value = useStore((state) => state[which]);
  const setPanelView = useStore((state) => state.setPanelView);
  return (
    <div ref={fref} className="panel" style={{ gridArea: which }}>
      <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {children}
      </View>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button>{value}</Button>
        </Menu.Target>
        <Menu.Dropdown onClick={(e) => setPanelView(which, (e.target as HTMLElement).innerText)}>
          <Menu.Item>Top</Menu.Item>
          <Menu.Item>Bottom</Menu.Item>
          <Menu.Item>Left</Menu.Item>
          <Menu.Item>Right</Menu.Item>
          <Menu.Item>Front</Menu.Item>
          <Menu.Item>Back</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
});
