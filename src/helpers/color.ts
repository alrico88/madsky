import chroma from "chroma-js";

export function getContrastColor(color: string): string {
  return chroma.contrast("white", color) < 4.5 ? "black" : "white";
}
