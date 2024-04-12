import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { Pane } from "tweakpane";
import { Ease24 } from "tween24";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";

const easings = [
  Ease24._1_SineOut,
  Ease24._1_SineInOut,
  Ease24._1_SineIn,
  Ease24._2_QuadOut,
  Ease24._2_QuadInOut,
  Ease24._2_QuadIn,
  Ease24._3_CubicOut,
  Ease24._3_CubicInOut,
  Ease24._3_CubicIn,
  Ease24._4_QuartOut,
  Ease24._4_QuartInOut,
  Ease24._4_QuartIn,
  Ease24._5_QuintOut,
  Ease24._5_QuintInOut,
  Ease24._5_QuintIn,
  Ease24._6_ExpoOut,
  Ease24._6_ExpoInOut,
  Ease24._6_ExpoIn,
  Ease24._7_CircOut,
  Ease24._7_CircInOut,
  Ease24._7_CircIn,
].reduce<{ [key: string]: string }>((acc, f) => {
  const name = Object.entries(Ease24).find(([key, value]) => value === f)?.[0] ?? "";
  acc[name] = name;
  return acc;
}, {});

export const Params = {
  showUv: false,
  distortion: 1,
  speed: 1,
  frequency: 1,
  transitionInterval: 5,
  transitionDuration: 3.0,
  transitionEasing: easings._4_QuartOut,
  rippleInDuration: 0.5,
  rippleInEasing: easings._4_QuartOut,
  rippleOutDuration: 3.0,
  rippleOutEasing: easings._1_SineInOut,
};

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  pane.registerPlugin(EssentialsPlugin);
  const rippleFolder = pane.addFolder({ title: "Ripple" });
  rippleFolder.expanded = false;
  rippleFolder.addBinding(Params, "showUv");
  rippleFolder.addBinding(Params, "distortion", {
    label: "Distortion",
    min: 0,
    max: 5,
  });
  rippleFolder.addBinding(Params, "speed", {
    label: "Speed",
    min: 0,
    max: 2,
  });
  rippleFolder.addBinding(Params, "frequency", {
    label: "Frequency",
    min: 0,
    max: 2,
  });
  const transitionFolder = pane.addFolder({ title: "Transition" });
  transitionFolder.expanded = false;
  transitionFolder.addBinding(Params, "transitionInterval", {
    label: "Interval",
    min: 0.1,
    max: 10,
  });
  transitionFolder.addBinding(Params, "transitionDuration", {
    label: "Fade",
    min: 0.1,
    max: 5,
  });
  transitionFolder.addBinding(Params, "transitionEasing", {
    label: "--Easing",
    options: easings,
  });
  transitionFolder.addBinding(Params, "rippleInDuration", {
    label: "RippleIn",
    min: 0.1,
    max: 5,
  });
  transitionFolder.addBinding(Params, "rippleInEasing", {
    label: "--Easing",
    options: easings,
  });
  transitionFolder.addBinding(Params, "rippleOutDuration", {
    label: "RippleOut",
    min: 0.1,
    max: 5,
  });
  transitionFolder.addBinding(Params, "rippleOutEasing", {
    label: "--Easing",
    options: easings,
  });

  const fpsGraph = pane.addBlade({
    view: "fpsgraph",
    label: "fps",
    rows: 2,
  }) as FpsGraphBladeApi;
  //

  //
  pane.addButton({ title: "dump" }).on("click", () => {
    const str = JSON.stringify(Params, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      console.log(Params);
    });
  });

  return { fpsGraph };
};
