import { Pane } from "tweakpane";
export const Params = {
  size: 1024,
  texSize: 512,
  pointSize: 0.01,
  pointAlpha: 0.1,
  probability: 0.95,
  progress: 0,
};

export const initUI = (resetScene: () => void) => {
  // const pane = new Pane();
  // pane.addBinding(Params, "size", { min: 4, max: 2048, step: 4 }).on("change", () => {
  //   resetScene();
  // });
  // pane.addBinding(Params, "texSize", { min: 4, max: 2048, step: 4 }).on("change", () => {
  //   resetScene();
  // });
  // pane.addBinding(Params, "probability", { min: 0.8, max: 1, step: 0.0001 }).on("change", () => {
  //   resetScene();
  // });
  // pane.addBinding(Params, "pointSize", { min: 0.01, max: 5, step: 0.01 });
  // pane.addBinding(Params, "pointAlpha", { min: 0.05, max: 1, step: 0.01 });
  // pane.addBinding(Params, "progress", { min: 0, max: 1, step: 0.01 });
};
