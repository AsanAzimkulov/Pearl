import { getOverlappingSection } from "./getOverlappingSection";

export function filterByGenres(movies, genres) {
  const filteredMovies = [];

  movies.forEach((movie) => {
    if (
      genres.some((oneFromSelectedGenres) =>
        movie.info.genre
          .split(",")
          .some(
            (genre) =>
              getOverlappingSection(genre.toLowerCase(), oneFromSelectedGenres.toLowerCase())
                .length
          )
      )
    ) {
      filteredMovies.push(movie);
    }
  });

  return filteredMovies;
}
