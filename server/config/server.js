export const SERVER = {
  BASE_URL: "http://localhost:8080",
  PORT: 8080,
  ALLOWED_ORIGIN: ["*"],
  CORS: {
    origin: (origin, callback) => {
      if (SERVER.ALLOWED_ORIGIN.indexOf(origin) !== -1 || !origin)
        callback(null, true);
      callback(new Error("Not allowed by CORS."));
    },
    successStatus: 200,
  },
};
