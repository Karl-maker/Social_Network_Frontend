import Connect from "../Connection";
import Post from "./Post";
import axios from "axios";

/*

Dealing with searching and getting posts

*/

export default class PostCollection extends Connect {
  constructor(base_url, access_token, { coordinates }) {
    super(base_url, access_token);

    this.coordinates = coordinates || { latitude: null, longitude: null };
  }

  // Methods

  async fetchManyPosts({ page_number, page_size, max_distance }) {
    const result = await axios.get(
      `${this.base_url}/api/posts?max_distance=${max_distance}&page_size=${page_size}&page_number=${page_number}&latitude=${this.coordinates.latitude}&longitude=${this.coordinates.longitude}`
    );
    let data_list = [];

    for (let i = 0; i < result.data[0].data.length; i++) {
      data_list.push(
        new Post(this.base_url, this.access_token, {
          data: result.data[0].data[i],
        })
      );
    }

    return { meta_data: result.data[0].meta_data, data: data_list };
  }

  async fetchShares(id) {
    const result = await axios.get(`${this.base_url}/api/post/shares${id}`);
    let data_list = [];

    for (let i = 0; i < result.data.length; i++) {
      data_list.push(
        new Post(this.base_url, this.access_token, { data: result.data[i] })
      );
    }

    return { data: data_list };
  }

  async fetchReplies(id) {
    const result = await axios.get(`${this.base_url}/api/post/replies${id}`);
    let data_list = [];

    for (let i = 0; i < result.data.length; i++) {
      data_list.push(
        new Post(this.base_url, this.access_token, { data: result.data[i] })
      );
    }

    return { data: data_list };
  }

  // Getters and Setters

  get coordinates() {
    return this._coordinates;
  }

  set coordinates(coordinates) {
    this._coordinates = coordinates;
  }
}
