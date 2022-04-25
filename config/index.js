const ACCESS_KEYS = JSON.parse(process.env.ACCESS_KEYS);
const REFRESH_KEYS = JSON.parse(process.env.REFRESH_KEYS);

const variables = {
  bcrypt: {
    SALTORROUNDS: 10,
  },

  jwt: {
    ISSUER: "Syncviz",
    ALGORITHM: "RS256",
    IS_HTTPS: false,

    ACCESS_TOKEN_LIFE: "30d",
    ACCESS_TOKEN_PUBLIC_KEY: ACCESS_KEYS.public,
    ACCESS_TOKEN_PRIVATE_KEY: ACCESS_KEYS.private,

    REFRESH_TOKEN_PUBLIC_KEY: REFRESH_KEYS.public,
    REFRESH_TOKEN_PRIVATE_KEY: REFRESH_KEYS.private,
    REFRESH_TOKEN_LIFE: "30d",
  },
};

const config = { ...variables };

export default config;
