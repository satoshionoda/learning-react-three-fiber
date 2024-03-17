import { modes, state } from "@apps/examples/basics/transform-controls-and-make-default/state.ts";
import { useCursor, useGLTF } from "@react-three/drei";
import { type FC, useState } from "react";
import { useSnapshot } from "valtio";
import type { Mesh } from "three";

type Props = { name: string } & JSX.IntrinsicElements["mesh"];
export const Model: FC<Props> = ({ name, ...props }) => {
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Fetching the GLTF, nodes is a collection of all the meshes
  // It's cached/memoized, it only gets loaded and parsed once
  const { nodes } = useGLTF("/assets/mesh/compressed.glb");
  const mesh = nodes[name] as Mesh;
  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <mesh
      // Click sets the mesh as the new target
      onClick={(e) => {
        e.stopPropagation();
        state.current = name;
      }}
      // If a click happened but this mesh wasn't hit we null out the target,
      // This works because missed pointers fire before the actual hits
      onPointerMissed={(e) => {
        if (e.type === "click") {
          state.current = null;
        }
      }}
      // Right click cycles through the transform modes
      onContextMenu={(e) => {
        if (snap.current === name) {
          e.stopPropagation();
          state.mode = (snap.mode + 1) % modes.length;
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => setHovered(false)}
      name={name}
      geometry={mesh.geometry}
      material={mesh.material}
      material-color={snap.current === name ? "#ff6080" : "white"}
      {...props}
      dispose={null}
    />
  );
};
