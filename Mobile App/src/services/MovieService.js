import axios from "axios";
import { Storage } from "../components/Storage";
class MovieService {
  constructor() {
    this.resourceUrl = "http://bazon.cc/api/search";
    this.token = "4d76c2a99eb3964a8eeaccaebcb0db35";
  }

  async fetchFilms(title) {
    let response;
    if (title.length == 0) return [];

    try {
      response = await axios.get(
        this.resourceUrl + "?token=" + this.token + "&title=" + title
      );
    } catch (error) {
      console.log("MovieService.fetchFilms error: " + JSON.stringify(error));
    }
    return response.data.results;
  }

  async fetchFilmByKp(kp) {
    let response;
    console.log(this.resourceUrl + "?token=" + this.token + "&kp=" + kp);
    try {
      response = await axios.get(
        this.resourceUrl + "?token=" + this.token + "&kp=" + kp
      );
    } catch (error) {
      console.log("MovieService.fetchFilms error: " + JSON.stringify(error));
    }
    return response.data.results && response.data.results.length
      ? response.data.results[0]
      : null;
  }

  addMovieToFavorites(movie) {
    const favorites = Storage.contains("favorites")
      ? JSON.parse(Storage.getString("favorites"))
      : [];

    favorites.push(movie);

    Storage.set("favorites", JSON.stringify(favorites));
  }
  removeMovieFromFavorites(movie) {
    const favorites = Storage.contains("favorites")
      ? JSON.parse(Storage.getString("favorites"))
      : [];

    const index = favorites.findIndex(
      (favMovie) => favMovie["kinopoisk_id"] === movie["kinopoisk_id"]
    );

    if (index != -1) {
      favorites.splice(index, 1);
    }

    Storage.set("favorites", JSON.stringify(favorites));
  }

  toggleMovieFromFavorites(movie) {
    const favorites = Storage.contains("favorites")
      ? JSON.parse(Storage.getString("favorites"))
      : [];

    const index = favorites.findIndex(
      (favMovie) => favMovie["kinopoisk_id"] === movie["kinopoisk_id"]
    );
    if (favorites && index != -1) {
      this.removeMovieFromFavorites(movie);
    } else {
      this.addMovieToFavorites(movie);
    }
  }

  getFavoriteMovies() {
    return Storage.contains("favorites")
      ? JSON.parse(Storage.getString("favorites"))
      : [];
  }

  isInFavoriteMovies(movie) {
    const favorites = Storage.contains("favorites")
      ? JSON.parse(Storage.getString("favorites"))
      : [];

    const index = favorites.findIndex(
      (favMovie) => favMovie["kinopoisk_id"] === movie["kinopoisk_id"]
    );
    return favorites && index != -1;
  }
}

export default new MovieService();
