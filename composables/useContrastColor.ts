import chroma from "chroma-js";

export function useContrastColor(
  colorRef: MaybeRefOrGetter<string>
): ComputedRef<string> {
  return computed(() => {
    const color = toValue(colorRef);

    return chroma.contrast("white", color) < 4.5 ? "black" : "white";
  });
}
