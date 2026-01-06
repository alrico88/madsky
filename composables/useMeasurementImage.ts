export function useMeasurementImage(id: MaybeRefOrGetter<string>) {
  const defaultPng =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  const imageUrl = ref(defaultPng);

  const measurementId = toRef(id);

  const loadImage = useDebounceFn(async () => {
    if (imageUrl.value === defaultPng) {
      imageUrl.value = `/api/image/${measurementId.value}`;
    }
  }, 100);

  const unloadImage = useDebounceFn(() => {
    {
      imageUrl.value = defaultPng;
    }
  });

  return {
    imageUrl,
    loadImage,
    unloadImage,
  };
}
