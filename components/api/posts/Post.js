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

    try {
      const results = await post_collections.fetchShares(this.data._id);

      return results;
    } catch (err) {
      return;
    }
  }

  async fetchReplies() {
    const post_collections = new PostCollection(
      this.base_url,
      this.access_token
    );

    try {
      const results = await post_collections.fetchReplies(this.data._id);

      return results;
    } catch (err) {
      return;
    }
  }

  async likeButtonInteraction() {
    try {
      const results = await axios.post(
        `${this.base_url}/api/activity`,
        {
          post_id: this.data._id,
          type: "like",
        },
        { headers: { Authorization: `Bearer ${this.access_token}` } }
      );

      return results;
    } catch (err) {
      return;
    }
  }

  async dislikeButtonInteraction() {
    try {
      const results = await axios.post(
        `${this.base_url}/api/activity`,
        {
          post_id: this.data._id,
          type: "dislike",
        },
        { headers: { Authorization: `Bearer ${this.access_token}` } }
      );

      return results;
    } catch (err) {
      return;
    }
  }

  async checkActivityStatus(post_id) {
    try {
      const results = await axios.get(
        `${this.base_url}/api/activity/${post_id}`,
        { headers: { Authorization: `Bearer ${this.access_token}` } }
      );

      if (results.status !== 200) {
        throw results;
      }

      return results;
    } catch (error) {
      return;
    }
  }

  async createAReply(content, reply) {
    const body = {
      content,
      replied_to: reply,
      longitude: this.coordinates.longitude,
      latitude: this.coordinates.latitude,
    };

    try {
      const result = await axios.post(`${this.base_url}/api/post`, body, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });
      return result;
    } catch (err) {
      return;
    }
  }

  async createAShare(content, share) {
    const body = {
      content,
      shared_from: share,
      longitude: this.coordinates.longitude,
      latitude: this.coordinates.latitude,
    };

    try {
      const result = await axios.post(`${this.base_url}/api/post`, body, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });
      return result;
    } catch (err) {
      return;
    }
  }

  async create(content) {
    if (!content) {
      return false;
    }

    const body = {
      content,
      longitude: this.coordinates.longitude,
      latitude: this.coordinates.latitude,
    };

    try {
      const result = await axios.post(`${this.base_url}/api/post`, body, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete() {
    try {
      const result = await axios.delete(
        `${this.base_url}/api/post/${this.data._id}`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        }
      );

      return result;
    } catch (err) {
      return;
    }
  }
}
