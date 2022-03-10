import Connect from "../Connection";
import PostCollection from "./PostCollection";
import axios from "axios";

/*

Dealing with individual posts

*/

export default class Post extends Connect {
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

  async likeButtonInteraction() {}

  async dislikeButtonInteraction() {}
}
