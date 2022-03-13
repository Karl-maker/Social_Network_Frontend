import Connect from "../Connection";
import PostCollection from "./PostCollection";
import axios from "axios";

/*

Dealing with individual posts

*/

export default class Post extends Connect {
  constructor(base_url, access_token, { data, coordinates }) {
    super(base_url, access_token);

    this.data = data || null;
    this.coordinates = coordinates || { latitude: null, longitude: null };
    this.config = {
      headers: { Authorization: `Bearer ${this.access_token}` },
    };
  }

  // Getters and Setters

  get data() {
    return this._data;
  }

  get coordinates() {
    return this._coordinates;
  }
  set data(data) {
    this._data = data;
  }

  set coordinates(coordinates) {
    this._coordinates = coordinates;
  }

  // Methods

  async fetchShares() {
    const post_collections = new PostCollection(
      this.base_url,
      this.access_token
    );
    const results = await post_collections.fetchShares(this.data._id);

    return results;
  }

  async fetchReplies() {
    const post_collections = new PostCollection(
      this.base_url,
      this.access_token
    );
    const results = await post_collections.fetchReplies(this.data._id);

    return results;
  }

  async likeButtonInteraction() {
    const results = await axios.post(
      `${this.base_url}/api/activity`,
      {
        post_id: this.data._id,
        type: "like",
      },
      this.config
    );

    return results;
  }

  async dislikeButtonInteraction() {
    const results = await axios.post(
      `${this.base_url}/api/activity`,
      {
        post_id: this.data._id,
        type: "dislike",
      },
      this.config
    );

    return results;
  }

  async checkActivityStatus(post_id) {
    const results = await axios.get(
      `${this.base_url}/api/activity/${post_id}`,
      this.config
    );

    return results;
  }

  async createAReply(content) {
    const body = {
      content,
      replied_to: this._data._id,
      longitude: this.coordinates.longitude,
      latitude: this.coordinates.latitude,
    };

    const result = await axios.post(
      `${this.base_url}/api/post`,
      body,
      this.config
    );
    return result;
  }

  async createAShare(content) {
    const body = {
      content,
      shared_from: this._data._id,
      longitude: this.coordinates.longitude,
      latitude: this.coordinates.latitude,
    };

    const result = await axios.post(
      `${this.base_url}/api/post`,
      body,
      this.config
    );
    return result;
  }
}
