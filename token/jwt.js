import jwt from "jsonwebtoken";
import config from "../config";
import Login from "../model/logins";
import User from "../model/user";

export default {
  createRefreshToken,
  createAccessToken,
  getAccessTokenWithRefreshToken,
  deleteRefreshToken,
};

async function deleteRefreshToken(refresh_token) {
  const REFRESH_TOKEN_PUBLIC_KEY = config.jwt.REFRESH_TOKEN_PUBLIC_KEY;

  const payload = await jwt.verify(refresh_token, REFRESH_TOKEN_PUBLIC_KEY, {
    algorithm: [config.jwt.ALGORITHM],
  });

  if (!payload) {
    throw { name: "UnauthorizedError" };
  }

  try {
    await Login.findOneAndDelete({
      user_id: payload.user._id,
      token: refresh_token,
    });
  } catch (err) {
    throw { name: "UnexpectedError" };
  }

  return;
}

async function createRefreshToken(user) {
  const body = {
    _id: user._id,
    email: user.email,
  };
  const refresh_token = await jwt.sign(
    { user: body },
    config.jwt.REFRESH_TOKEN_PRIVATE_KEY,
    {
      expiresIn: config.jwt.REFRESH_TOKEN_LIFE,
      algorithm: config.jwt.ALGORITHM,
    }
  );

  return refresh_token;
}

async function createAccessToken(user) {
  const body = {
    _id: user._id,
    email: user.email,
  };
  const access_token = await jwt.sign(
    { user: body },
    config.jwt.ACCESS_TOKEN_PRIVATE_KEY,
    {
      expiresIn: config.jwt.ACCESS_TOKEN_LIFE,
      algorithm: config.jwt.ALGORITHM,
    }
  );

  return access_token;
}

async function getAccessTokenWithRefreshToken(refresh_token) {
  const REFRESH_TOKEN_PUBLIC_KEY = config.jwt.REFRESH_TOKEN_PUBLIC_KEY;
  let user, login;
  const payload = await jwt.verify(refresh_token, REFRESH_TOKEN_PUBLIC_KEY, {
    algorithm: [config.jwt.ALGORITHM],
  });

  if (!payload) {
    throw { name: "Unauthorized", message: "Expired" };
  }

  try {
    login = await Login.findOne({
      user_id: payload.user._id,
      token: refresh_token,
    });

    user = await User.findOne({ _id: login.user_id });
  } catch (err) {
    throw err;
  }

  if (!user) {
    throw { name: "Unauthorized", message: "No User Found" };
  }

  return await createAccessToken(user);
}
