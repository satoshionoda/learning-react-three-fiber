import * as THREE from "three";
import { Params } from "@/functions/ui.ts";
import { uniforms } from "@/functions/uniformts.ts";

const virtualCursor = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const raycasterMesh = new THREE.Mesh();
// new THREE.IcosahedronGeometry(0.5, Params.point),
// new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })

export const setupRaycaster = (scene: THREE.Scene, camera: THREE.Camera) => {
  // scene.add(raycasterMesh);
  // window.addEventListener("mousemove", (e) => {
  //   onMouseMove(e, camera);
  // });
};

const onMouseMove = (e: MouseEvent, mainCamera: THREE.Camera) => {
  // const x = (e.clientX / window.innerWidth) * 2 - 1;
  // const y = -(e.clientY / window.innerHeight) * 2 + 1;
  // raycaster.setFromCamera(new THREE.Vector2(x, y), mainCamera);
  // const intersects = raycaster.intersectObjects([raycasterMesh]);
  // if (intersects.length > 0) {
  //   uniforms.uMouse.value = intersects[0].point;
  //   // virtualCursor.x += (intersects[0].point.x - virtualCursor.x) * 0.05;
  //   // virtualCursor.y += (intersects[0].point.y - virtualCursor.y) * 0.05;
  //   // virtualCursor.z += (intersects[0].point.z - virtualCursor.z) * 0.05;
  //   // uniforms.uMouse.value = virtualCursor;
  // }
};
