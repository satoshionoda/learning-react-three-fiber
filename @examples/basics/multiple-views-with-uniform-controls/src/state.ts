import { create } from "zustand";

export type Positions = "Top" | "Bottom" | "Left" | "Right" | "Back" | "Front";
export type CameraNames = "top" | "middle" | "bottom";
export const useStore = create<
  {
    projection: string;
    setPanelView: (which: string, view: string) => void;
    setProjection: (projection: string) => void;
  } & Record<CameraNames, Positions>
>((set) => ({
  projection: "Perspective",
  top: "Back",
  middle: "Top",
  bottom: "Right",
  setPanelView: (which, view) => set({ [which]: view }),
  setProjection: (projection) => set({ projection }),
}));
