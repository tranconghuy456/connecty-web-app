// import axios from "../api/axios";
import axios from "axios";
import ENV from "../config.js";

axios.defaults.baseURL = ENV.SERVER_BASE_URL;
// authenticate function //
export async function authenticate(email) {
  try {
    return await axios.post("/api/authenticate", { email });
  } catch ({ response }) {
    return response.data;
  }
}
