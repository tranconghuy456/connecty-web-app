import axios from "../api/axios";
import * as ENV from "../configs/root.js";

const userRouter = `${ENV.API["BASE_URL"]}/users`;

const verifyUserByUsername = async (username) => {
  try {
    return await axios.post(userRouter, { username });
  } catch ({ response }) {
    return response.data;
  }
};

export { verifyUserByUsername };
