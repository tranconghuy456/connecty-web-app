import jwt from "jsonwebtoken";
import * as ENV from "../config/config.js";
import { UserTokenModel } from "../models/User.model.js";

// sign access token
export const signAccessToken = async (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    if (!refreshToken) throw new Error();
    try {
      // if vaild token
      const payload = {
        userId: await verifyRefreshToken(refreshToken),
      };
      const options = {
        expiresIn: ENV.ACCESS_TOKEN_EXP,
      };

      // sign access token
      jwt.sign(
        payload,
        ENV.ACCESS_TOKEN_PRIVATE_KEY,
        options,
        (error, token) => {
          if (error) throw new Error();
          resolve(token);
        }
      );
    } catch (error) {
      throw error;
    }
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
        if (error) throw new Error();
        resolve(token);
      }
    );
  });
};

// verify refresh token
export const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    // verify token
    jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN_PRIVATE_KEY,
      (error, payload) => {
        // error case
        switch (error?.name) {
          case "JsonWebTokenError":
            // verify failed
            throw new Error({
              error: true,
              message: "Invalid token.",
            });
          case "TokenExpiredError":
            // expired token
            // re-generate refresh token
            // checkpoint
            //     try {
            //       UserTokenModel.find(
            //         (person) => person.token === refreshToken
            //       ).then(async (user) => {
            //         if (!user) reject(null); // not found
            //         // re-generate refresh token
            //         const newRefreshToken = await signRefreshToken(user.userId);
            //         // update db
            //         UserTokenModel.findOneAndUpdate(
            //           { userId: user.userId },
            //           {
            //             expiresIn: ENV.REFRESH_TOKEN_EXP,
            //             token: newRefreshToken,
            //           },
            //           (error, doc) => {
            //             if (error)
            //               reject(new Error({ error: true, data: { error } }));
            //             resolve(newRefreshToken);
            //           }
            //         );
            //       });
            //     } catch (error) {
            //       reject(new Error({ error: true, data: { error } }));
            //     }
            throw new Error();
        }
        resolve(payload);
      }
    );
  });
};
