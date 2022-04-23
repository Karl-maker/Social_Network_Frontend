import axios from "axios";

/*

09/03/2022 9:25AM

All children of this class will be a TYPE of connection.

This helps dealing with accesstokens baseurls and other aspects all HTTP or Socket.io requests will need


*/

export default class Connection {
  constructor(base_url, access_token) {
    this.base_url = base_url;
    this.access_token = access_token;
  }

  // Getters

  get baseUrl() {
    return this._base_url;
  }

  // Get AccessToken
  get access_token() {
    return this._access_token;
  }

  // Setters

  set access_token(access_token) {
    this._access_token = access_token;
  }

  set baseUrl(base_url) {
    this._base_url = base_url;
  }

  // Methods

  async fetchGetGeneral(url, body, config) {
    const result = await axios.get(`${this.base_url}${url}`, body, {
      headers: { Authorization: `Bearer ${this.access_token}` },
      ...config,
    });
    return result;
  }
}
