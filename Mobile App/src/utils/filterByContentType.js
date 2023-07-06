export function filterByContentType(movies, appliedContentTypes) {
  return movies.filter((movie) => {
    if (appliedContentTypes.length == 2) return movies;
    else
      return appliedContentTypes[0] === "Сериалы"
        ? movie.serial == 1
        : movie.serial == 0;
  });
}
