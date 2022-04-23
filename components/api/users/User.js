import Connection from "../Connection";
import axios from "axios";
import { Chip, Avatar } from "@mui/material";

export default class User extends Connection {
  constructor(base_url, access_token, { display_name, username }) {
    super(base_url, access_token);

    this._id;
    this._email;
    this._username = username || null;
    this._display_name = display_name || null;
    this._isLoggedIn = false;
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

  set username(username) {
    this._username = username;
  }

  set display_name(display_name) {
    this._display_name = display_name;
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
        withCredentials: true,
      });

      this._isLoggedIn = false;

      return;
    } catch (err) {
      return;
    }
  }

  // JSX

  displayProfileChip({ borderWidth, color, variant }) {
    return (
      <Chip
        variant={variant || "outlined"}
        avatar={this.displayProfilePicture(23)}
        sx={{
          borderWidth: borderWidth || "0px solid",
          color: color || "#2d3436",
        }}
        label={
          this._username ? (
            <>
              <strong>{this._display_name}</strong>{" "}
              <small>@{this._username}</small>
            </>
          ) : (
            <strong>{this._display_name}</strong>
          )
        }
      />
    );
  }

  displayProfilePicture(size) {
    return (
      <Avatar sx={{ bgcolor: "#dfe6e9" }}>
        {this._username ? (
          <>
            {this._username.toUpperCase().charAt(0) ||
              this._display_name.toUpperCase().charAt(0)}
          </>
        ) : (
          <>{this._display_name.toUpperCase().charAt(0)}</>
        )}
      </Avatar>
    );
  }
}
