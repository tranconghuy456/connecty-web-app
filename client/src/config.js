const config = {
  SERVER_BASE_URL: "http://localhost:8080",
  AUTH_PATH: "/api/authenticate",
  VERIFY_PATH: "/api/login",
  REGISTER_PATH: "/api/register",
  IMAGE_SIZE: 10 * 1024 * 1024,
  FILE_SIZE: 20 * 1024,
  IMAGE_SUPPORTED: ["image/jpg", "image/jpeg", "image/webg", "image/png"],
  PROFILE_STORAGE: "/profile",
};

export default config;
