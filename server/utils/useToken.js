import jwt from "jsonwebtoken";
import ENV from "../config.js";
import { UserTokenModel } from "../models/User.model.js";

// sign access token
export const signAccessToken = async (refreshToken) => {
    if (refreshToken) {
      // if has refresh token
      const payload = {
        userId: await verifyRefreshToken(refreshToken)
      }
      const options = {
        expiresIn: ENV.ACCESS_TOKEN_EXP,
      }
      // create access token
      jwt.sign(payload, ENV.ACCESS_TOKEN_PRIVATE_KEY, options, (error, token) => {
        if (error) return {
          error: true,
          data: {error}
        }
        return token;
      })
    } else
        return {
          error: true,
          data: {}
        }
}

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
        if (error) reject(null);
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
     async (error, payload) => {
        switch (error?.name) {
          case "JsonWebTokenError":
            // JWT verify error
            reject(new Error({error: true, message: "Invalid token."}));
          case "TokenExpiredError":
            // JWT expired
            // Re-generate refresh token
            const user = await UserTokenModel.find(person => person.token === refreshToken);
            if (!user) reject(null);
            const RT = await signRefreshToken(user.userId);
            await UserTokenModel.findOneAndUpdate({userId: user.userId}, {
              expiresIn: ENV.REFRESH_TOKEN_EXP,
              token: RT
            });
            break;
        }
      }
    );
  });
};
