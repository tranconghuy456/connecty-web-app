import * as ENV from "../config/config.js";

const credentials = (req, res, next) => {
  const allowedOrigins = ENV.SERVER.ALLOWED_ORIGIN;
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin))
    res.headers("Access-Control-Allow-Credentials", true);
  next();
};

export { credentials };
