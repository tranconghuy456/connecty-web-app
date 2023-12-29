import { SERVER } from "../configs/server.js";

export const credentials = (req, res, next) => {
  let origin = req.header("Origin");

  if (SERVER["ALLOWED_ORIGIN"].indexOf(origin) !== -1 || origin == "*") {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
