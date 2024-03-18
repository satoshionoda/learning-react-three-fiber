// Reactive state model, using Valtio ...
import { proxy } from "valtio";

export const modes = ["translate", "rotate", "scale"] as const;
export const state = proxy<{ current: string | null; mode: number }>({ current: null, mode: 0 });
