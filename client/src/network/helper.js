// import axios from "../api/axios";
import axios from "axios";
import ENV from "../config.js";

axios.defaults.baseURL = ENV.SERVER_BASE_URL;
// authenticate function //
export async function authenticate(email) {
  try {
    let response = await axios.get(`${ENV.AUTH_PATH}/${email}`);
    return response;
  } catch ({ response }) {
    return response;
  }
}

// login function //
export async function login(email, password) {
  try {
    let response = await axios.post(ENV.VERIFY_PATH, { email, password });
    return response;
  } catch ({ response }) {
    return response;
  }
}

// register function //
export async function register(data) {
  const { firstname, lastname, email, password, job, phone, photoURL } = data;
  console.log(data);
  try {
    let response = await axios.post(ENV.REGISTER_PATH, {
      firstname,
      lastname,
      email,
      password,
      job,
      phone,
      photoURL,
    });
    return response;
  } catch ({ response }) {
    return response;
  }
}
