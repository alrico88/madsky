export function usePage(baseUrl: string) {
  const route = useRoute();

  const currPage = computed(() => Number(route.query.page ?? 0));

  const nextPage = computed(() => ({
    name: baseUrl,
    query: {
      page: currPage.value + 1,
    },
  }));

  return {
    currPage,
    nextPage,
  };
}
