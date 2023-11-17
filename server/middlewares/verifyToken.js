import jwt from "jsonwebtoken";
import * as ENV from "../config/config.js";
import { UserTokenModel } from "../models/User.model.js";

const verifyAccessToken = async (req, res, next) => {
  try {
    const header = req.headers["x-access-token"] || req.headers.Authorization;

    if (!header?.startWith("Bearer ")) return res.sendStatus(401);

    const token = header.split(" ")[1];

    // verify access token
    jwt.verify(
      token,
      ENV.TOKEN.ACCESS_TOKEN_PRIVATE_KEY,
      async (error, payload) => {
        // handle verify error
        switch (error.name) {
          case "TokenExpiredError":
            // expired token
            try {
              req.locals.accessToken = await verifyRT();
              next();
            } catch (error) {
              return res.status(403).json({
                errorStatus: true,
                errorCode: "INVALID_TOKEN",
                errorMessage: "Invalid token.",
                data: {},
              });
            }
            break;
          default:
            return res.status(403).json({
              errorStatus: true,
              errorCode: "INVALID_TOKEN",
              errorMessage: "Invalid token.",
              data: {},
            });
        }
        // save token
        req.locals.accessToken = token;
        next();
      }
    );
  } catch (error) {
    return res.status(500).json({
      errorStatus: true,
      errorCode: "SERVER_ERROR",
      errorMessage: "Internal server error.",
      data: { error },
    });
  }
};

// verify refresh token
const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    // if invalid
    if (!refreshToken)
      return res.status(401).json({
        errorStatus: true,
        errorCode: "INVALID_TOKEN",
        errorMessage: "Invalid token.",
        data: {},
      });

    // if valid
    // get user
    let user = await UserTokenModel.findOne({ refreshToken });
    // if not found
    if (!user)
      return res.status(401).json({
        errorStatus: true,
        errorCode: "INVALID_TOKEN",
        errorMessage: "Invalid token.",
        data: {},
      });

    // if found
    // verify refresh token
    jwt.verify(
      refreshToken,
      ENV.TOKEN.REFRESH_TOKEN_PRIVATE_KEY,
      async (error, payload) => {
        // if error
        if (error.name || user._id.toHexString() !== payload.uid)
          return res.status(401).json({
            errorStatus: true,
            errorCode: "INVALID_TOKEN",
            errorMessage: "Invalid token.",
            data: {},
          });

        // if succeed
        return jwt.sign({
          user: {
            uid: payload.uid,
            roles: user.roles,
          },
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      errorStatus: true,
      errorCode: "SERVER_ERROR",
      errorMessage: "Internal server error.",
      data: { error },
    });
  }
};

export { verifyAccessToken, verifyRefreshToken };
