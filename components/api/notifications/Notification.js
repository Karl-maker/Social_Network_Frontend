import Connection from "../Connection";
import axios from "axios";

export default class Notification extends Connection {
  constructor(base_url, access_token, { data }) {
    super(base_url, access_token);

    this.data = data;
  }

  // Getters and Setters

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  async delete() {
    try {
      await axios.delete(`${this.base_url}/api/notification/${this.data._id}`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      return;
    } catch (err) {
      return;
    }
  }

  async seen() {
    try {
      await axios.post(`${this.base_url}/api/notification/${this.data._id}`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      return;
    } catch (err) {
      return;
    }
  }
}
