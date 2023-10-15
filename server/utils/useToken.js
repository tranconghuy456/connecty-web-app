import jwt from "jsonwebtoken";
import ENV from "../config.js";
import { UserTokenModel } from "../models/User.model.js";

// sign access token
export const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const options = {
      expiresIn: ENV.ACCESS_TOKEN_EXP,
    };

    jwt.sign(payload, ENV.ACCESS_TOKEN_PRIVATE_KEY, options, (error, token) => {
      if (error) reject(error);
      resolve(token);
    });
  });
};

// sign refresh token
export const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const options = {
      expiresIn: ENV.REFRESH_TOKEN_EXP,
    };
    jwt.sign(
      payload,
      ENV.REFRESH_TOKEN_PRIVATE_KEY,
      options,
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

// userId: {
//     type: Schema.Types.ObjectId,
//     required: true,
//   },
//   token: { type: String, required: true },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: 30 * 86400, // 30 days
//   },

// verify refresh token
export const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN_PRIVATE_KEY,
      (error, payload) => {
        if (error) reject(error);
        resolve(payload);
      }
    );
  });
};
