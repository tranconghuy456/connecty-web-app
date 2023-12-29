var corsOptions;

export const SERVER = {
  PORT: 8080,
  BASE_URL: `http://localhost:8080`,
  ALLOWED_ORIGIN: ["http://localhost:3000"],
  CORS: (req, callback) => {
    if (
      SERVER.ALLOWED_ORIGIN.indexOf(req.header("Origin")) !== -1 ||
      req.header("Origin") == "*"
    ) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  },
};
