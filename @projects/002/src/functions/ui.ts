import * as THREE from "three";
import { Pane } from "tweakpane";
export const Params = {
  point: 68,
  pointAlpha: 0.11000000000000006,
  maxPointSize: 5.8,
  minPointSize: 3,
  blendMode: 2,
  waveSize: 62,
  waveComplexity: 4.3,
  waveSpeedX: 17,
  waveSpeedY: 28,
  ior: 1.33,
  gamma: 1.53,
  inverseFresnel: true,
  fresnelPower: 1.0999999999999996,
  colorA: "#ffaed2",
  colorB: "#ffcfa4",
  colorC: "#cef8ff",
  colorD: "#9b8eff",
  stepA: 0.33,
  stepB: 0.43000000000000005,
  stepC: 0.75,
  stepD: 0.9999999999999999,
  useColorA: true,
  useColorB: true,
  useColorC: true,
  useColorD: true,
};

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  const tabs = pane.addTab({ pages: [{ title: "base" }, { title: "colors" }] });
  const baseTab = tabs.pages[0];
  const colorsTab = tabs.pages[1];

  const point = baseTab.addFolder({ title: "Point" });
  point
    .addBinding(Params, "point", { min: 16, max: 256, step: 1, label: "Point" })
    .on("change", () => {
      resetScene();
    });
  point.addBinding(Params, "maxPointSize", { min: 1, max: 10, step: 0.1, label: "Max Size" });
  point.addBinding(Params, "minPointSize", { min: 0.1, max: 10, step: 0.1, label: "Min Size" });
  point.addBinding(Params, "pointAlpha", { min: 0.05, max: 1, step: 0.01, label: "Alpha" });
  point
    .addBinding(Params, "blendMode", {
      label: "Blend",
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
  const wave = baseTab.addFolder({ title: "Wave" });
  wave.addBinding(Params, "waveSize", { min: 1, max: 100, step: 1, label: "Size" });
  wave.addBinding(Params, "waveComplexity", { min: 0.1, max: 10, step: 0.1, label: "Complexity" });
  wave.addBinding(Params, "waveSpeedX", { step: 1, label: "SpeedX" });
  wave.addBinding(Params, "waveSpeedY", { step: 1, label: "SpeedY" });
  const fresnel = colorsTab.addFolder({ title: "Fresnel" });
  fresnel.addBinding(Params, "inverseFresnel", { label: "Inverse" });
  fresnel.addBinding(Params, "ior", { min: 0, max: 3, step: 0.01, label: "IoR" });
  fresnel.addBinding(Params, "fresnelPower", { min: 0, max: 10, step: 0.1, label: "Power" });
  fresnel.addBinding(Params, "gamma", { min: 0, max: 3, step: 0.01, label: "Gamma" });
  const colorA = colorsTab.addFolder({ title: "Color A" });
  colorA.addBinding(Params, "useColorA", { label: "Use" });
  colorA.addBinding(Params, "colorA", { label: "Color" });
  colorA.addBinding(Params, "stepA", { min: 0, max: 1, step: 0.01, label: "Step" });
  const colorB = colorsTab.addFolder({ title: "Color B" });
  colorB.addBinding(Params, "useColorB", { label: "Use" });
  colorB.addBinding(Params, "colorB", { label: "Color" });
  colorB.addBinding(Params, "stepB", { min: 0, max: 1, step: 0.01, label: "Step" });
  const colorC = colorsTab.addFolder({ title: "Color C" });
  colorC.addBinding(Params, "useColorC", { label: "Use" });
  colorC.addBinding(Params, "colorC", { label: "Color" });
  colorC.addBinding(Params, "stepC", { min: 0, max: 1, step: 0.01, label: "Step" });
  const colorD = colorsTab.addFolder({ title: "Color D" });
  colorD.addBinding(Params, "useColorD", { label: "Use" });
  colorD.addBinding(Params, "colorD", { label: "Color" });
  colorD.addBinding(Params, "stepD", { min: 0, max: 1, step: 0.01, label: "Step" });

  pane.addButton({ title: "dump" }).on("click", () => {
    const str = JSON.stringify(Params, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      console.log(Params);
    });
  });
};
