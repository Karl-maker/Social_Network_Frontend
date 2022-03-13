import Connection from "../Connection";
import axios from "axios";

export default class User extends Connection {
  constructor(base_url, access_token, {}) {
    super(base_url, access_token);

    this.id;
    this.email;
    this.username;
    this.display_name;

    this.config = {
      headers: { Authorization: `Bearer ${this.access_token}` },
    };
  }

  // Getters And Setters

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get username() {
    return this._username;
  }

  get display_name() {
    return this._display_name;
  }

  async fetchUserInformation(id) {
    const results = await axios.get(
      `${this.base_url}/api/profile/${id || this.id}`
    );
    this._username = results.data[0].user[0].username;
    this._display_name = results.data[0].display_name;
    return results.data[0];
  }

  async fetchCurrentUser() {
    const result = await axios.get(`${this.base_url}/api/user`, this.config);

    if (result.status === 200) {
      this._id = result.data._id;
      this._email = result.data.email;
      return true;
    }

    return false;
  }
}
