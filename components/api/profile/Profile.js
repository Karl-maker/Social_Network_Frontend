import axios from "axios";
import Connection from "../Connection";

class Profile extends Connection {
  constructor(base_url, access_token, { display_name, bio }) {
    super(base_url, access_token);

    this.display_name = display_name;
    this.bio = bio;
    this.is_verified;
    this.user_id;
    this.username;
  }

  // Getters and Setters

  get display_name() {
    return this._display_name;
  }

  get bio() {
    return this._bio;
  }

  get is_verified() {
    return this._is_verified;
  }

  get user_id() {
    return this._user_id;
  }

  get username() {
    return this._username;
  }

  set display_name(display_name) {
    this._display_name = display_name;
  }

  set bio(bio) {
    this._bio = bio;
  }

  async create({ display_name, bio }) {
    const result = await axios.post(
      `${this.base_url}/api/profile`,
      { display_name: display_name || this.display_name, bio: bio || this.bio },
      {
        headers: { Authorization: `Bearer ${this.access_token}` },
      }
    );

    return result;
  }

  async update({ display_name, bio }) {
    const result = await axios.put(
      `${this.base_url}/api/profile`,
      { display_name: display_name || this.display_name, bio: bio || this.bio },
      {
        headers: { Authorization: `Bearer ${this.access_token}` },
      }
    );
    return result;
  }

  async getById(id) {
    const result = await axios.get(`${this.base_url}/api/profile/${id}`, {
      headers: { Authorization: `Bearer ${this.access_token}` },
    });

    let data;

    if (result.status === 200) {
      data = result.data[0];

      this._display_name = data.display_name;
      this._bio = data.bio;
      this._is_verified = data.is_verified;
      this._username = data.user[0].username;
    }

    return result;
  }
}