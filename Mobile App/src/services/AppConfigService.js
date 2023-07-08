import axios from "axios";

class AppConfigService {
  constructor() {
    this.resourceUrl = "https://64a6b342096b3f0fcc805afa.mockapi.io";
    this.configEndpoint = "/config";
  }

  async fetchData() {
    this.config = (
      await axios.get(this.resourceUrl + this.configEndpoint)
    ).data[0];
  }
}

const appConfigService = new AppConfigService();

appConfigService.initPromise = appConfigService.fetchData();

export default appConfigService;
