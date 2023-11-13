import * as ENV from "../config/config.js";
import jwt from "jsonwebtoken";

const generateAT = async ({ uid, roles }) => {
  return new Promise((resolve, reject) => {
    resolve(
      jwt.sign(
        {
          user: {
            uid: uid,
            roles: roles,
          },
        },
        ENV.TOKEN.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: ENV.TOKEN.ACCESS_TOKEN_EXP }
      )
    );
    reject();
  });
};

// Refresh token generator
const generateRT = async ({ uid }) => {
  return new Promise((resolve, reject) => {
    resolve(
      jwt.sign({ user: { uid: uid } }, ENV.TOKEN.REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: ENV.TOKEN.REFRESH_TOKEN_EXP,
      })
    );
    reject();
  });
};

export { generateAT, generateRT };
