import axios from "axios";

class MovieService {
  constructor() {
    this.resourceUrl = "http://bazon.cc/api/search";
    this.token = "4d76c2a99eb3964a8eeaccaebcb0db35";
  }

  async fetchFilms(title) {
    const params = new FormData();
    params.append("token", this.token);
    params.append("title", title);
    let response;

    try {
      response = await axios.get(
        this.resourceUrl + "?token=" + this.token + "&title=" + title
      );
    } catch (error) {
      console.log("MovieService.fetchFilms error: " + JSON.stringify(error));
    }
    return response.data.results;
  }
}

export default new MovieService();
