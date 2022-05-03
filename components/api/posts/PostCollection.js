import Connect from "../Connection";
import Post from "./Post";
import axios from "axios";

/*

Dealing with searching and getting posts

*/

export default class PostCollection extends Connect {
  constructor(base_url, access_token, { coordinates, max_distance }) {
    super(base_url, access_token);

    this.coordinates = coordinates || { latitude: null, longitude: null };
    this.max_distance = max_distance || 5000;
    this.page_number = 0;
    this.page_size = 10;
    this.location = "";
    this.total = 0;

    this.LOCATIONS = [
      {
        location: "Port of Spain, Trinidad and Tobago",
        latitude: 10.650488900252434,
        longitude: -61.51599120383046,
      },
      // {
      //   location: "New York City, United States of America",
      //   latitude: 40.73061,
      //   longitude: -73.935242,
      // },
      // {
      //   location: "Great Britain, United Kingdom",
      //   latitude: 53.826,
      //   longitude: -2.422,
      // },
    ];
  }

  // Getters and Setters

  get coordinates() {
    return this._coordinates;
  }

  set coordinates(coordinates) {
    this._coordinates = coordinates;
  }

  get location() {
    return this._location;
  }

  set location(location) {
    this._location = location;
  }

  get total() {
    return this._total;
  }

  set total(total) {
    this._total = total;
  }

  get max_distance() {
    return this._max_distance;
  }

  set max_distance(max_distance) {
    this._max_distance = max_distance;
  }

  get page_number() {
    return this._page_number;
  }

  set page_number(page_number) {
    this._page_number = page_number;
  }

  get page_size() {
    return this._page_size;
  }

  set page_size(page_size) {
    this._page_size = page_size;
  }

  // Methods

  locationRandomizer() {
    const { location, latitude, longitude } =
      this.LOCATIONS[Math.floor(Math.random() * this.LOCATIONS.length)];

    this._coordinates = {
      latitude: latitude,
      longitude: longitude,
    };

    this._location = location;
  }

  async fetchUserPosts(user_id, { access_token }) {
    return fetch(
      `${this.base_url}/api/posts/${user_id}?page_size=${this.page_size}&page_number=${this.page_number}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token || this.access_token}`,
        },
      }
    )
      .then(async (response) => {
        // Check status code

        if (!response.ok) {
          throw await response.json();
        }
        return response;
      })
      .then((response) => response.json())
      .then(async (result) => {
        let data_list = [];

        for (let i = 0; i < result[0].data.length; i++) {
          data_list.push(
            new Post(this.base_url, this.access_token, {
              data: result[0].data[i],
            })
          );
        }

        try {
          this._total = result[0].metadata[0].total || 0;
        } catch (err) {
          this._total = 0;
        }

        try {
          return {
            meta_data: result[0].metadata || { total: 0 },
            data: data_list,
          };
        } catch (err) {
          return {
            meta_data: { total: 0 },
            data: [],
          };
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  async newFetchManyPosts() {
    try {
      const result = await axios.get(
        `${this.base_url}/api/posts?max_distance=${this.max_distance}&page_size=${this.page_size}&page_number=${this.page_number}&latitude=${this.coordinates.latitude}&longitude=${this.coordinates.longitude}`
      );
      let data_list = [];

      for (let i = 0; i < result.data[0].data.length; i++) {
        data_list.push(
          new Post(this.base_url, this.access_token, {
            data: result.data[0].data[i],
          })
        );
      }

      this._total = result.data[0].metadata[0].total;

      return { meta_data: result.data[0].metadata, data: data_list };
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async fetchManyPosts({ page_number, page_size, max_distance }) {
    try {
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
    } catch (err) {
      return;
    }
  }

  async fetchShares(id) {
    const result = await axios.get(`${this.base_url}/api/post/shares${id}`);
    let data_list = [];

    try {
      for (let i = 0; i < result.data.length; i++) {
        data_list.push(
          new Post(this.base_url, this.access_token, { data: result.data[i] })
        );
      }

      return { data: data_list };
    } catch (err) {
      return;
    }
  }

  async fetchReplies(id, { page_size, page_number }) {
    try {
      const result = await axios.get(
        `${this.base_url}/api/post/replies/${id}?page_number=${page_number}&page_size=${page_size}`
      );
      let data_list = [];

      for (let i = 0; i < result.data.length; i++) {
        let item = new Post(this.base_url, this.access_token, {
          data: result.data[i],
        });

        data_list.push(item);
      }

      return { data: data_list };
    } catch (err) {
      return;
    }
  }
}
