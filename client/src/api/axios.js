import axios from "axios";
import * as ENV from "../configs/root.js";

export default axios.create({
  baseURL: ENV.API["BASE_URL"],
});

const axiosPrivate = axios.create({
  baseURL: ENV.API["BASE_URL"],
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export { axiosPrivate };
