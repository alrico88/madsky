import { type Component, createMemo } from "solid-js";
import { useClipboard, whenever } from "solidjs-use";
import Toast from "bootstrap/js/dist/toast";

interface ColorPreviewProps {
  color: string;
  textColor: string;
  class?: string;
}

export const ColorPreview: Component<ColorPreviewProps> = (props) => {
  const { copied, copy } = useClipboard({
    source: () => props.color,
  });

  whenever(copied, () => {
    const toastBootstrap = Toast.getOrCreateInstance("#clipToast");

    toastBootstrap.show();
  });

  const classList = createMemo(() => {
    return `btn bg-color font-monospace opacify ${props.class}`;
  });

  return (
    <button
      class={classList()}
      style={{
        "background-color": props.color,
        "border-color": props.textColor,
        color: props.textColor,
      }}
      onClick={() => copy()}
      title="Copiar color al portapapeles"
    >
      {props.color}
    </button>
  );
};
