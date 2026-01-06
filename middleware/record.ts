import is from "@sindresorhus/is";

export default defineNuxtRouteMiddleware(async (to) => {
  const data = await $fetch(`/api/measurement/id/${to.params.id}`);

  if (is.nullOrUndefined(data)) {
    return abortNavigation({
      statusCode: 404,
      message: "Record not found",
    });
  }
});
