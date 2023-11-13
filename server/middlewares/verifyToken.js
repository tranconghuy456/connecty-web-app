import jwt from "jsonwebtoken";
import * as ENV from "../config/config.js";
import { verifyRT } from "../controllers/authController.js";

export default (req, res, next) => {
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
            return res
              .status(403)
              .json({ message: "Invalid token.", data: error });
          }
          break;
        default:
          return res
            .status(403)
            .json({ message: "Invalid token.", data: error.name });
      }
      //
      req.locals.accessToken = token;
      next();
    }
  );
};
