import * as ENV from "../config/config.js";

export default (req, res, next) => {
  const allowedOrigins = ENV.SERVER.ALLOWED_ORIGIN;
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin))
    res.headers("Access-Control-Allow-Credentials", true);
  next();
};
