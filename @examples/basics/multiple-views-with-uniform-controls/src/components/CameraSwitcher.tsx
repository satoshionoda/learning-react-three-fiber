import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useStore } from "@/state.ts";

export const CameraSwitcher = () => {
  const projection = useStore((state) => state.projection);
  // Would need to remember the old coordinates to be more useful ...
  return projection === "Perspective" ? (
    <PerspectiveCamera makeDefault position={[4, 4, 4]} fov={25} />
  ) : (
    <OrthographicCamera makeDefault position={[4, 4, 4]} zoom={280} />
  );
};
