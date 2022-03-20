import Connection from "../Connection";
import Notification from "./Notification";
import axios from "axios";

class NotificationCollection extends Connection {
  constructor(base_url, access_token, {}) {
    super(base_url, access_token);
  }

  // Methods

  async fetchManyNotifications({ page_number, page_size }) {
    try {
      const results = await axios.get(
        `${this.base_url}/api/notifications?page_size=${page_size}&page_number=${page_number}`,
        { headers: { Authorization: `Bearer ${this.access_token}` } }
      );

      let data_list = [];

      for (let i = 0; i < results.data.length; i++) {
        let item = new Notification(this.base_url, this.access_token, {
          data: results.data[i],
        });

        data_list.push(item);
      }
      return { data: data_list };
    } catch (err) {
      return;
    }
  }
}
