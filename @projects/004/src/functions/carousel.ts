import * as THREE from "three";
import { Ease24, Tween24 } from "tween24";
import { uniforms } from "@/functions/uniformts.ts";

const textures: THREE.Texture[] = [];
let currentIndex = 0;
let timeout = 0;
let isTransitioning = false;

export const loadTextures = async () => {
  const imgNames = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"];
  const promises: Promise<THREE.Texture>[] = [];
  imgNames.forEach((imgName) => {
    const loader = new THREE.TextureLoader();
    promises.push(loader.loadAsync(`/assets/${imgName}`));
  });
  const result: THREE.Texture[] = await Promise.all(promises);
  textures.push(...result);
  currentIndex = 0;
  doTransition(currentIndex);
};

const getTexture = (index: number): THREE.DataTexture => {
  const modIndex = index % textures.length;
  return textures[modIndex] as THREE.DataTexture;
};

/**
 *
 * @param x -1(left) -> 1(top)
 * @param y -1(top) -> 1(bottom)
 */
export const showNext = (x: number, y: number) => {
  doTransition(currentIndex + 1, x, y);
};

const doTransition = (index: number, x: number = 0, y: number = 0) => {
  if (isTransitioning) return;
  isTransitioning = true;
  clearTimeout(timeout);
  currentIndex = index;
  uniforms.uImgA.value = getTexture(index);
  uniforms.uImgB.value = getTexture(index + 1);
  uniforms.uProgress.value = 0;
  uniforms.uRippleCenter.value.set(x, y);
  const currentTween = Tween24.parallel(
    Tween24.tween(uniforms.uProgress, 3.0, Ease24._4_QuartOut, { value: 1 }),
    Tween24.serial(
      Tween24.tween(uniforms.uDistortionAmount, 0.5, Ease24._4_QuartOut, { value: 0.5 }),
      Tween24.tween(uniforms.uDistortionAmount, 3.0, Ease24._1_SineInOut, { value: 0 })
    )
  ).onComplete(() => {
    isTransitioning = false;
    timeout = window.setTimeout(() => {
      doTransition(currentIndex + 1);
    }, 5000);
  });
  currentTween.play();
};
