import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { Pane } from "tweakpane";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";

export const Params = {
  showUv: true,
  param1: 0.5,
  param2: 0,
  param3: 0,
  param4: 0,
};

export const initUI = (resetScene: () => void) => {
  const pane = new Pane();
  pane.registerPlugin(EssentialsPlugin);
  pane.addBinding(Params, "showUv");

  pane.addBinding(Params, "param1", { label: "param1", min: 0, max: 3 });
  pane.addBinding(Params, "param2", { label: "param2", min: 0, max: 1 });
  pane.addBinding(Params, "param3", { label: "param3", min: 0, max: 1 });
  pane.addBinding(Params, "param4", { label: "param4", min: 0, max: 1 });

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
