import {
  AccumulativeShadows,
  MapControls,
  OrbitControls,
  PivotControls,
  RandomizedLight,
  View,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import useRefs from "react-use-refs";
import { Matrix4 } from "three";
import { CameraSwitcher } from "@/components/CameraSwitcher.tsx";
import { MainPanel } from "@/components/MainPanel.tsx";
import { PanelCamera } from "@/components/PanelCamera.tsx";
import { Scene } from "@/components/Scene.tsx";
import { SidePanel } from "@/components/SidePanel.tsx";

const matrix = new Matrix4();
export default function App() {
  const [view1, view2, view3, view4] = useRefs<HTMLDivElement>(null!);
  return (
    <div className="container">
      {/** A single canvas, it will only render when things move or change, and otherwise stay idle ... */}
      <Canvas
        shadows
        frameloop="demand"
        eventSource={document.getElementById("root")!}
        className="canvas"
      >
        {/** Each view tracks one of the divs above and creates a sandboxed environment that behaves
             as if it were a normal everyday canvas, <View> will figure out the gl.scissor stuff alone. */}
        <View.Port />
      </Canvas>
      {/** Tracking div's, regular HTML and made responsive with CSS media-queries ... */}
      <MainPanel ref={view1}>
        <CameraSwitcher />
        <PivotControls scale={0.4} depthTest={false} matrix={matrix} />
        <Scene background="aquamarine" matrix={matrix}>
          <AccumulativeShadows
            temporal
            frames={100}
            position={[0, -0.4, 0]}
            scale={14}
            alphaTest={0.85}
            color="orange"
            colorBlend={0.5}
          >
            <RandomizedLight
              amount={8}
              radius={8}
              ambient={0.5}
              position={[5, 5, -10]}
              bias={0.001}
            />
          </AccumulativeShadows>
        </Scene>
        <OrbitControls makeDefault />
      </MainPanel>
      <SidePanel ref={view2} which="top">
        <PanelCamera which="top" />
        <PivotControls activeAxes={[true, true, false]} depthTest={false} matrix={matrix} />
        <Scene background="lightpink" matrix={matrix} />
        <MapControls makeDefault screenSpacePanning enableRotate={false} />
      </SidePanel>
      <SidePanel ref={view3} which="middle">
        <PanelCamera which="middle" />
        <PivotControls activeAxes={[true, false, true]} depthTest={false} matrix={matrix} />
        <Scene background="peachpuff" matrix={matrix} />
        <MapControls makeDefault screenSpacePanning enableRotate={false} />
      </SidePanel>
      <SidePanel ref={view4} which="bottom">
        <PanelCamera which="bottom" />
        <PivotControls activeAxes={[false, true, true]} depthTest={false} matrix={matrix} />
        <Scene background="skyblue" matrix={matrix} />
        <MapControls makeDefault screenSpacePanning enableRotate={false} />
      </SidePanel>
    </div>
  );
}
