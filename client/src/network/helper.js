// import axios from "../api/axios";
import axios from "axios";
// import { storage } from "../firebaseConfig.js";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
//   uploadBytes,
// } from "firebase/storage";
import ENV from "../config.js";

axios.defaults.baseURL = ENV.SERVER_BASE_URL;
// authenticate function //
export async function authenticate(username) {
  try {
    let response = await axios.get(`${ENV.AUTH_PATH}/${username}`);
    return response;
  } catch ({ response }) {
    return response;
  }
}

// login function //
export async function login(username, password) {
  try {
    let response = await axios.post(ENV.VERIFY_PATH, { username, password });
    return response;
  } catch ({ response }) {
    return response;
  }
}

// register function //
export async function signUp(value) {
  console.log(value);
  try {
    // upload imageFile using firebase storage
    // const storage = getStorage();
    // const storageRef = ref(
    //   storage,
    //   `${username}/${ENV.PROFILE_STORAGE}/images/photo`
    // );
    // upload task
    // const uploadTask = await uploadBytes(storageRef, photoFile);
    // get image URL
    // const photoURL = await getDownloadURL(uploadTask.ref);

    let response = await axios.post("/api/register", value);
    return response;
  } catch ({ response }) {
    return response;
  }
}

// upload image function //
export async function uploadImage(imageFile, path) {}
