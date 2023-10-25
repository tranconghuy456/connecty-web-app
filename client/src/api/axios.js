import ENV from "../config.js";
import axios from "axios";

export default axios.create({
  baseURL: ENV.SERVER_BASE_URL,
});

// export const axiosPrivate = axios.create({
//   baseURL: ENV.SERVER_BASE_URL,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });
