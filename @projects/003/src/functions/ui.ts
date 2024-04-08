import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { Pane } from "tweakpane";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";

const MIX_TYPE_RGB = 0;
const MIX_TYPE_HSL = 1;
const MIX_TYPE_LCH = 2;
const MIX_TYPE_LAB = 3;
const MIX_TYPE_HSB = 4;

export const Params = {
  type: 2,
  dither: 1,
  rotation: -156.5217391304348,
  scale: 8,
  rotationSpeed: 0,
  offsetSpeed: 5,
  colorA: "#1f005c",
  colorB: "#ffb56b",
  colorC: "#ffb56b",
  colorD: "#1f005c",
  colorE: "#ff0000",
  colorF: "#00ff00",
  colorG: "#0000ff",
  colorH: "#ffff00",
  stepA: 0.05,
  stepB: 0.44999999999999996,
  stepC: 0.55,
  stepD: 0.9500000000000001,
  stepE: 1,
  stepF: 1,
  stepG: 1,
  stepH: 1,
  useColorA: true,
  useColorB: true,
  useColorC: true,
  useColorD: true,
  useColorE: false,
  useColorF: false,
  useColorG: false,
  useColorH: false,
  infoText: "This is a shader experiment.\nThis is a shader experiment.",
};

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  pane.registerPlugin(EssentialsPlugin);
  const tabs = pane.addTab({ pages: [{ title: "basic" }, { title: "colors" }, { title: "info" }] });
  const basicTab = tabs.pages[0];
  const colorsTab = tabs.pages[1];
  const infoTab = tabs.pages[2];
  //
  basicTab.addBinding(Params, "type", {
    label: "type",
    options: {
      RGB: MIX_TYPE_RGB,
      HSL: MIX_TYPE_HSL,
      LCH: MIX_TYPE_LCH,
      LAB: MIX_TYPE_LAB,
      HSB: MIX_TYPE_HSB,
    },
  });
  basicTab.addBinding(Params, "rotation", { label: "rotation", min: -360, max: 360 });
  basicTab.addBinding(Params, "scale", { label: "scale", min: 0.1, max: 20 });
  basicTab.addBinding(Params, "dither", { label: "dither", min: 0, max: 50 });
  const animation = basicTab.addFolder({ title: "animation" });
  animation.addBinding(Params, "rotationSpeed", { label: "rotation", min: -10, max: 10 });
  animation.addBinding(Params, "offsetSpeed", { label: "offset", min: -10, max: 10 });
  const fpsGraph = pane.addBlade({
    view: "fpsgraph",
    label: "fps",
    rows: 2,
  }) as FpsGraphBladeApi;
  //
  const colorA = colorsTab.addFolder({ title: "Color A" });
  const useA = colorA.addBinding(Params, "useColorA", { label: "Use" });
  const valueA = colorA.addBinding(Params, "colorA", { label: "Color" });
  const stepA = colorA.addBinding(Params, "stepA", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseA = () => (valueA.disabled = stepA.disabled = !Params.useColorA);
  useA.on("change", onChangeUseA);
  onChangeUseA();
  colorA.expanded = !valueA.disabled;

  const colorB = colorsTab.addFolder({ title: "Color B" });
  const useB = colorB.addBinding(Params, "useColorB", { label: "Use" });
  const valueB = colorB.addBinding(Params, "colorB", { label: "Color" });
  const stepB = colorB.addBinding(Params, "stepB", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseB = () => (valueB.disabled = stepB.disabled = !Params.useColorB);
  useB.on("change", onChangeUseB);
  onChangeUseB();
  colorB.expanded = !valueB.disabled;

  const colorC = colorsTab.addFolder({ title: "Color C" });
  const useC = colorC.addBinding(Params, "useColorC", { label: "Use" });
  const valueC = colorC.addBinding(Params, "colorC", { label: "Color" });
  const stepC = colorC.addBinding(Params, "stepC", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseC = () => (valueC.disabled = stepC.disabled = !Params.useColorC);
  useC.on("change", onChangeUseC);
  onChangeUseC();
  colorC.expanded = !valueC.disabled;

  const colorD = colorsTab.addFolder({ title: "Color D" });
  const useD = colorD.addBinding(Params, "useColorD", { label: "Use" });
  const valueD = colorD.addBinding(Params, "colorD", { label: "Color" });
  const stepD = colorD.addBinding(Params, "stepD", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseD = () => (valueD.disabled = stepD.disabled = !Params.useColorD);
  useD.on("change", onChangeUseD);
  onChangeUseD();
  colorD.expanded = !valueD.disabled;

  const colorE = colorsTab.addFolder({ title: "Color E" });
  const useE = colorE.addBinding(Params, "useColorE", { label: "Use" });
  const valueE = colorE.addBinding(Params, "colorE", { label: "Color" });
  const stepE = colorE.addBinding(Params, "stepE", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseE = () => (valueE.disabled = stepE.disabled = !Params.useColorE);
  useE.on("change", onChangeUseE);
  onChangeUseE();
  colorE.expanded = !valueE.disabled;

  const colorF = colorsTab.addFolder({ title: "Color F" });
  const useF = colorF.addBinding(Params, "useColorF", { label: "Use" });
  const valueF = colorF.addBinding(Params, "colorF", { label: "Color" });
  const stepF = colorF.addBinding(Params, "stepF", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseF = () => (valueF.disabled = stepF.disabled = !Params.useColorF);
  useF.on("change", onChangeUseF);
  onChangeUseF();
  colorF.expanded = !valueF.disabled;

  const colorG = colorsTab.addFolder({ title: "Color G" });
  const useG = colorG.addBinding(Params, "useColorG", { label: "Use" });
  const valueG = colorG.addBinding(Params, "colorG", { label: "Color" });
  const stepG = colorG.addBinding(Params, "stepG", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseG = () => (valueG.disabled = stepG.disabled = !Params.useColorG);
  useG.on("change", onChangeUseG);
  onChangeUseG();
  colorG.expanded = !valueG.disabled;

  const colorH = colorsTab.addFolder({ title: "Color H" });
  const useH = colorH.addBinding(Params, "useColorH", { label: "Use" });
  const valueH = colorH.addBinding(Params, "colorH", { label: "Color" });
  const stepH = colorH.addBinding(Params, "stepH", { min: 0, max: 1, step: 0.01, label: "Step" });
  const onChangeUseH = () => (valueH.disabled = stepH.disabled = !Params.useColorH);
  useH.on("change", onChangeUseH);
  onChangeUseH();
  colorH.expanded = !valueH.disabled;

  // infoTab.addBinding(Params, "infoText", { label: "info", readonly: true });

  const text = infoTab.addBlade({
    view: "text",
    value: "",
    multiline: true,
    readonly: true,
    rows: 5,
    parse: (v: string) => String(v),
  });
  const elm = text.controller.view.element;
  const input = elm.querySelector("input")!;
  const wrapper = input.parentElement!;
  input.remove();
  const paragraph = document.createElement("p");
  paragraph.style.backgroundColor = "var(--mo-bg)";
  paragraph.style.color = "var(--mo-fg)";
  paragraph.style.padding = "var(--bld-hp)";
  paragraph.style.borderRadius = "var(--bld-br)";
  paragraph.style.overflow = "hidden";
  paragraph.innerHTML = `Inspirations:<br />
* <a href="https://www.learnui.design/tools/gradient-generator.html" target="_blank">
VIVID GRADIENT GENERATOR TOOL
</a><br />
* <a href="https://www.gradient-animator.com" target="_blank">CSS GRADIENT ANIMATOR</a>
`;
  wrapper.appendChild(paragraph);
  infoTab.selected = true;

  //
  pane.addButton({ title: "dump" }).on("click", () => {
    const str = JSON.stringify(Params, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      console.log(Params);
    });
  });

  return { fpsGraph };
};
