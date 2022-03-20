import Connection from "../Connection";
import axios from "axios";

export default class User extends Connection {
  constructor(base_url, access_token, {}) {
    super(base_url, access_token);

    this.id;
    this.email;
    this.username;
    this.display_name;
    this.isLoggedIn = false;
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

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  set isLoggedIn(isLoggedIn) {
    this._isLoggedIn = isLoggedIn;
  }

  async fetchUserInformation(id) {
    try {
      const results = await axios.get(
        `${this.base_url}/api/profile/${id || this.id}`
      );

      try {
        this._username = results.data[0].user[0].username || "";
      } catch (error) {}

      try {
        this._display_name = results.data[0].display_name;
      } catch (error) {}

      return results.data[0];
    } catch (err) {
      return;
    }
  }

  async fetchCurrentUser() {
    try {
      const result = await axios.get(`${this.base_url}/api/user`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      if (result.status === 200) {
        this._id = result.data._id;
        this._email = result.data.email;
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async login(email, password) {
    try {
      const result = await axios.post(
        `${this.base_url}/api/login`,
        {
          password,
          email,
        },
        { withCredentials: true }
      );

      if (result.status === 200) {
        this.access_token = result.data.access_token;

        await this.fetchCurrentUser();
        await this.fetchUserInformation(this._id);

        this._isLoggedIn = true;

        return result;
      }
    } catch (err) {
      return false;
    }
  }

  async authenticate() {
    try {
      const result = await axios.post(
        `${this.base_url}/api/authenticate`,
        {},
        {
          withCredentials: true,
        }
      );

      if (result.status === 200) {
        this.access_token = result.data.access_token;

        await this.fetchCurrentUser();
        await this.fetchUserInformation(this._id);

        this._isLoggedIn = true;
        return true;
      }

      this._isLoggedIn = false;

      return false;
    } catch (err) {
      return false;
    }
  }

  async register(email, password) {
    try {
      const result = await axios.post(`${this.base_url}/api/register`, {
        email,
        password,
      });

      if (result.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async sendConfirmationEmail(email) {
    try {
      const result = await axios.post(
        `${this.base_url}/api/send-confirmation-email/${email}`
      );

      if (result.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async createUsername(username) {
    try {
      const result = await axios.post(
        `${this.base_url}/api/username`,
        {
          username,
        },
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        }
      );

      if (result.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async updatePassword(password) {
    try {
      const result = await axios.put(
        `${this.base_url}/api/password`,
        {
          password,
        },
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        }
      );

      if (result.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async requestPasswordReset(email) {
    try {
      const result = await axios.post(
        `${this.base_url}/api/request-reset-password/${email}`
      );

      if (result.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async resetPassword(email, password, token) {
    try {
      const result = await axios.post(
        `${this.base_url}/api/reset-password/${email}`,
        { password, token }
      );

      if (result.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      return;
    }
  }

  async logout() {
    try {
      await axios.delete(`${this.base_url}/api/authenticate`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      this._isLoggedIn = false;

      return;
    } catch (err) {
      return;
    }
  }
}
