import Connection from "../Connection";
import axios from "axios";

export default class User extends Connection {
  constructor(base_url, access_token, {}) {
    super(base_url, access_token);
  }

  async fetchUserInformation(id) {
    const results = await axios.get(`${this.base_url}/api/profile/${id}`);
    return results.data[0];
  }
}
