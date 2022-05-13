import Connection from "../Connection";
import axios from "axios";
import cookie from "../../../helper/cookie";
import { Chip, Avatar } from "@mui/material";
import { GoVerified } from "react-icons/go";

export default class User extends Connection {
  constructor(
    base_url,
    access_token,
    { display_name, username, is_verified, id, image, bio }
  ) {
    super(base_url, access_token);

    this._id = id || null;
    this._email;
    this._username = username || null;
    this._display_name = display_name || null;
    this._isLoggedIn = false;
    this._is_verified = is_verified || false;
    this._image = image || null;
    this._bio = bio === "" ? "" : bio || null;
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

  get is_verified() {
    return this._is_verified;
  }

  get bio() {
    return this._bio;
  }

  set username(username) {
    this._username = username;
  }

  set bio(bio) {
    this._bio = bio;
  }

  set display_name(display_name) {
    this._display_name = display_name;
  }

  set isLoggedIn(isLoggedIn) {
    this._isLoggedIn = isLoggedIn;
  }

  set is_verified(is_verified) {
    this._is_verified = is_verified;
  }

  async updateProfile({ bio }, { access_token }) {
    return fetch(`${this.base_url}/api/profile`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token || this.access_token}`,
      },
      body: JSON.stringify({ bio: bio }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        this._bio = response.bio;

        return response;
      })
      .catch((error) => {
        console.log(response);
        throw error;
      });
  }

  async fetchUserData() {
    try {
      const results = await axios.get(`${this.base_url}/api/profile/`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      try {
        this._id = results.data[0].user_id || "";
      } catch (error) {}

      try {
        this._username = results.data[0].user[0].username || "";
      } catch (error) {}

      try {
        this._email = results.data[0].user[0].email || "";
      } catch (error) {}

      try {
        this._is_verified = results.data[0].is_verified || false;
      } catch (error) {}

      try {
        this._bio = results.data[0].bio || "";
      } catch (error) {
        this._bio = "";
      }

      try {
        this._image = results.data[0].image;
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
        this._username = result.data.username || null;
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async fetchUserInformation(id) {
    try {
      const results = await axios.get(
        `${this.base_url}/api/profile/${id || this.id}`
      );

      try {
        this._id = results.data[0].user_id || id;
      } catch (error) {}

      try {
        this._username = results.data[0].user[0].username || "";
      } catch (error) {}

      try {
        this._email = results.data[0].user[0].email || "";
      } catch (error) {}

      try {
        this._is_verified = results.data[0].is_verified || false;
      } catch (error) {}

      try {
        this._bio = results.data[0].bio || "";
      } catch (error) {
        this._bio = "";
      }

      try {
        this._image = results.data[0].image;
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
        this._username = result.data.username || null;
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  login(email, password) {
    return fetch(`/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response) => {
        // Check status code

        if (!response.ok) {
          throw await response.json();
        }
        return response;
      })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.access_token) {
          this._access_token = response.access_token;

          await this.fetchUserData();

          this._isLoggedIn = true;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  async authenticate() {
    return fetch(`/api/auth/authenticate`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Content-type": "API-Key",
      },
    })
      .then((response) => {
        // Check status code

        if (response.status === 200) {
          return response.json();
        }

        throw new Error({
          message: response.json().message || "Issue with authentication",
        });
      })
      .then(async (response) => {
        // get access_token and place in code

        this.access_token = response.access_token;
        await this.fetchUserData();

        this._isLoggedIn = true;
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  register(email, password) {
    if (!email) {
      throw {
        messages: "Email is required",
        fields: ["email"],
      };
    }
    return fetch(`/api/auth/registration`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response) => {
        // Check status code

        if (!response.ok) {
          throw await response.json();
        }
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
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

  createUsername(username) {
    return fetch(`${this.base_url}/api/username`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${this.access_token}`,
      },
      body: JSON.stringify({ username: username }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }

        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
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
    return fetch(`/api/auth/authenticate`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Content-type": "API-Key",
      },
    })
      .then(async (response) => {
        // Check status code

        if (!response.ok) {
          throw await response.json();
        }

        this._isLoggedIn = false;
        this._id = "";
        this._access_token = "";
        this._username = "";
        this._email = "";

        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  // JSX

  displayProfileChip({ borderWidth, color, variant, onlyUsername, fontSize }) {
    return (
      <Chip
        variant={variant || "outlined"}
        avatar={onlyUsername ? false : this.displayProfilePicture(23)}
        sx={{
          borderWidth: borderWidth || "0px solid",
          color: color || "#2d3436",
          fontSize: fontSize || "15px",
        }}
        label={
          this._username ? (
            <>
              <small>{this._username}</small>{" "}
              {this._is_verified && <GoVerified style={{ color: "#0984e3" }} />}{" "}
            </>
          ) : (
            <strong></strong>
          )
        }
      />
    );
  }

  displayProfilePicture(size) {
    return (
      <Avatar
        sx={{ bgcolor: "#dfe6e9", width: size, height: size }}
        src={this._image}
      >
        <>
          {this._username.toUpperCase().charAt(0) ||
            this._email.toUpperCase().charAt(0)}
        </>
      </Avatar>
    );
  }
}
