import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import * as THREE from "three";
import { Pane } from "tweakpane";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";
export const Params = {
  rotationSpeed: -0.001,
  count: 31600,
  pointShift: 0.196,
  pointAlpha: 0.8,
  maxPointSize: 4.699999999999999,
  minPointSize: 1.4999999999999998,
  backgroundColor: "#000000",
  colorA: "#edff0d",
  colorB: "#b600ff",
  blendMode: 1,
  bloomThreshold: 0.5,
  bloomIntensity: 1,
  bloomOpacity: 1,
  translation: 0,
};

Object.assign(Params, {
  rotationSpeed: 0.001,
  count: 600_000,
  pointShift: 0.109,
  pointAlpha: 0.8,
  maxPointSize: 3.599999999999999,
  minPointSize: 0.01,
  backgroundColor: "#000000",
  colorA: "#d1bd46",
  colorB: "#4c5d64",
  blendMode: 2,
  bloomThreshold: 0.14000000000000004,
  bloomIntensity: 9.78,
  bloomOpacity: 0.34,
  translation: 0,
});

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  pane.registerPlugin(EssentialsPlugin);
  const scene = pane.addFolder({ title: "Scene" });
  scene.addBinding(Params, "rotationSpeed", {
    min: -0.05,
    max: 0.05,
    step: 0.001,
    label: "rotation",
  });
  scene.addBinding(Params, "backgroundColor", { label: "background" });
  const points = pane.addFolder({ title: "Points" });
  points
    .addBinding(Params, "count", { min: 100, max: 1000000, step: 100 })
    .on("change", resetScene);
  points.addBinding(Params, "pointShift", { min: -1, max: 1, step: 0.001, label: "shift" });
  points
    .addBinding(Params, "blendMode", {
      label: "blend",
      options: {
        None: THREE.NoBlending,
        Normal: THREE.NormalBlending,
        Additive: THREE.AdditiveBlending,
        Multiply: THREE.MultiplyBlending,
        Subtractive: THREE.SubtractiveBlending,
      },
    })
    .on("change", () => {
      resetScene();
    });
  points.addBinding(Params, "maxPointSize", { min: 0.01, max: 15, step: 0.1, label: "max size" });
  points.addBinding(Params, "minPointSize", { min: 0.01, max: 15, step: 0.1, label: "min size" });
  points.addBinding(Params, "colorA");
  points.addBinding(Params, "colorB");
  const mod = pane.addFolder({ title: "Mod" });
  mod.addBinding(Params, "translation", { min: 0, max: 50, step: 0.1, label: "move" });

  const bloom = pane.addFolder({ title: "Bloom" });
  bloom.addBinding(Params, "bloomOpacity", { min: 0, max: 1, step: 0.01, label: "Opacity" });
  bloom.addBinding(Params, "bloomIntensity", { min: 0, max: 100, step: 0.01, label: "Intensity" });
  bloom.addBinding(Params, "bloomThreshold", { min: 0, max: 1, step: 0.01, label: "Threshold" });

  const fpsGraph = pane.addBlade({
    view: "fpsgraph",
    label: "fps",
    rows: 2,
  }) as FpsGraphBladeApi;

  pane.addButton({ title: "dump" }).on("click", () => {
    const str = JSON.stringify(Params, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      console.log(Params);
    });
  });

  return { fpsGraph };
};
