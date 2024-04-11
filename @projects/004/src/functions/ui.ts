import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { Pane } from "tweakpane";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";

export const Params = {
  showUv: false,
  distortion: 0.5,
  mx1: 10,
  my1: 0,
  mx2: 0,
  my2: 0,
  mx3: 0,
  my3: 0,
};
Object.assign(Params, {
  showUv: false,
  distortion: 0.26086956521739113,
  mx1: 5,
  my1: 5,
  mx2: -6.956521739130435,
  my2: -3.695652173913043,
  mx3: -0.21739130434782616,
  my3: 4.3478260869565215,
});
Object.assign(Params, {
  showUv: false,
  distortion: 3,
  mx1: 7.39130434782609,
  my1: 5,
  mx2: -6.956521739130435,
  my2: -3.695652173913043,
  mx3: -0.21739130434782616,
  my3: 4.3478260869565215,
});

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  pane.registerPlugin(EssentialsPlugin);
  pane.addBinding(Params, "showUv");

  pane.addBinding(Params, "distortion", {
    label: "Distortion",
    min: -2,
    max: 2,
  });
  pane.addBinding(Params, "mx1", {
    min: -10,
    max: 10,
  });

  pane.addBinding(Params, "my1", {
    min: -10,
    max: 10,
  });
  pane.addBinding(Params, "mx2", {
    min: -10,
    max: 10,
  });
  pane.addBinding(Params, "my2", {
    min: -10,
    max: 10,
  });
  pane.addBinding(Params, "mx3", {
    min: -10,
    max: 10,
  });
  pane.addBinding(Params, "my3", {
    min: -10,
    max: 10,
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
