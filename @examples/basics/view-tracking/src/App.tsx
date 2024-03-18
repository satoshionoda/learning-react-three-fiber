import {
  CameraShake,
  Center,
  OrbitControls,
  PivotControls,
  Preload,
  View,
} from "@react-three/drei";
import { addEffect, Canvas } from "@react-three/fiber";
import Lenis from "@studio-freight/lenis";
import { Common } from "@/components/Common.tsx";
import { Link } from "@/components/Link.tsx";
import { Apple, Candy, Duck, Flash, Soda, Target } from "@/components/Models.tsx";

// Use lenis smooth scroll
const lenis = new Lenis({ syncTouch: true });
// Integrate into fibers own raf loop instead of opening another
addEffect((t) => lenis.raf(t));

export default function App() {
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/** Regular HTML with canvas bits mixed into it (<View>) */}
        <div className="text">
          Work on{" "}
          <Link
            href="https://github.com/pmndrs/react-three-fiber/releases/tag/v8.0.0"
            text="version 8"
          >
            <Common />
            <Center>
              <Target scale={1.5} />
            </Center>
          </Link>{" "}
          has begun 3 Sep 2021.
          <View className="view translateX">
            <Common color="lightpink" />
            {/*
            displayValues is renamed to annotations
            https://github.com/pmndrs/drei/commit/27a6bf4a83fa6a007f9c0cd69537ee6bdbb14b43
            */}
            <PivotControls lineWidth={3} depthTest={false} annotations={false} scale={2}>
              <Soda scale={6} position={[0, -1.6, 0]} />
            </PivotControls>
            <OrbitControls makeDefault />
          </View>
          This is perhaps the biggest update to Fiber yet.
          <View className="view scale" style={{ height: 300 }}>
            <Common color="lightblue" />
            <Apple position={[0, -1, 0]} scale={14} />
            <OrbitControls makeDefault />
          </View>
          We've tried our best to keep breaking-changes to a minimum,
          <View className="view translateY">
            <Common color="lightgreen" />
            <Duck scale={2} position={[0, -1.6, 0]} />
            <CameraShake intensity={2} />
          </View>
          they mostly affect rarely used api's like attach.
          <View className="view scale">
            <Common color="peachpuff" />
            <Candy scale={3} />
          </View>
          This release brings a ton of performance related fixes,
          <View className="view translateX">
            <Common color="orange" />
            <Flash scale={3} />
          </View>
          but also includes some new and ground-breaking features.
        </div>
        {/** Fixed fullscreen canvas on top of everything, events tied to index root */}
        <Canvas
          style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }}
          eventSource={document.getElementById("root")!}
        >
          <View.Port />
          <Preload all />
        </Canvas>
      </div>
    </>
  );
}
