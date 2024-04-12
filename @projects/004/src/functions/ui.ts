import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { Pane } from "tweakpane";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";

export const Params = {
  showUv: false,
  distortion: 0.5,
  progress: 0,
};

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  pane.registerPlugin(EssentialsPlugin);
  pane.addBinding(Params, "showUv");

  pane.addBinding(Params, "distortion", {
    label: "Distortion",
    min: -2,
    max: 2,
  });

  pane.addBinding(Params, "progress", {
    label: "Progress",
    min: 0,
    max: 1,
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
