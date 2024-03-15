import * as THREE from "three";
import { Group, Mesh } from "three";
import { type FC, type MutableRefObject, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

const pointDist = 25;
const raycaster = new THREE.Raycaster();
const origVec = new THREE.Vector3();
const dirVec = new THREE.Vector3();
const cyl = new THREE.CylinderGeometry(0.02, 0.02);
const sph = new THREE.SphereGeometry(0.25, 20, 20);
const bas = new THREE.MeshBasicMaterial();
const tra = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.25 });

type Props = {} & JSX.IntrinsicElements["group"];
export const Rays: FC<Props> = (props) => {
  const ref = useRef<Group>(null!);
  const { count } = useControls({ count: { value: 100, min: 0, max: 5000 } });
  return (
    <>
      <group ref={ref} {...props} />
      {Array.from({ length: count }, (_, id) => {
        return <Ray key={id} target={ref} />;
      })}
    </>
  );
};

type RayProps = { target: MutableRefObject<Group> } & JSX.IntrinsicElements["group"];
const Ray: FC<RayProps> = ({ target }) => {
  const objRef = useRef<Group>(null!);
  const origMesh = useRef<Mesh>(null!);
  const hitMesh = useRef<Mesh>(null!);
  const cylinderMesh = useRef<Mesh>(null!);

  useEffect(() => {
    hitMesh.current.scale.multiplyScalar(0.5);
    origMesh.current.position.set(pointDist, 0, 0);
    objRef.current.rotation.x = Math.random() * 10;
    objRef.current.rotation.y = Math.random() * 10;
  }, []);

  const xDir = Math.random() - 0.5;
  const yDir = Math.random() - 0.5;

  useFrame((state, delta) => {
    const obj = objRef.current;
    obj.rotation.x += xDir * delta;
    obj.rotation.y += yDir * delta;
    origMesh.current.updateMatrixWorld();
    origVec.setFromMatrixPosition(origMesh.current.matrixWorld);
    dirVec.copy(origVec).multiplyScalar(-1).normalize();
    raycaster.set(origVec, dirVec);
    raycaster.firstHitOnly = true;
    const res = raycaster.intersectObject(target.current, true);
    const length = res.length ? res[0].distance : pointDist;
    hitMesh.current.position.set(pointDist - length, 0, 0);
    cylinderMesh.current.position.set(pointDist - length / 2, 0, 0);
    cylinderMesh.current.scale.set(1, length, 1);
    cylinderMesh.current.rotation.z = Math.PI / 2;
  });

  return (
    <group ref={objRef}>
      <mesh ref={origMesh} geometry={sph} material={bas} />
      <mesh ref={hitMesh} geometry={sph} material={bas} />
      <mesh ref={cylinderMesh} geometry={cyl} material={tra} />
    </group>
  );
};

/**
 * BVH が独自にプロパティを追加しているため定義が必要
 */
declare module "THREE" {
  export interface Raycaster {
    firstHitOnly?: boolean;
  }
}
