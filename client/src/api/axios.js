// MODULES //
import axios from "axios";
// CONFIGS
import ENV from "../config.js";

export default axios.create({
  baseURL: ENV.SERVER_BASE_URL,
});

export const axiosSecure = axios.create({
  baseURL: ENV.SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
