// MODULES
import express from "express";
import httpContext from "express-http-context";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { v4 } from "uuid";
// CONTROLLERS
import router from "./router/auth.route.js";
import { useConnect } from "./helpers/db_connection_single.js";
import * as ENV from "./config/config.js";
import * as middlewares from "./middlewares/middlewares.js";
import logger from "./logs/logger.js";

// init app
const app = express();

// custom middleware logger
// app.use(logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(middlewares.credentials);

// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware for json
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//middleware for cookies
app.use(cookieParser());

app.use(morgan("tiny"));
app.disable("x-powered-by");

// context
const port = ENV.SERVER.PORT;

// Default GET Request
app.get("/", (req, res, next) => {
  res.send("Home request /");
});

// API routes
app.use("/api/v1", router);

// db connection
const db = await useConnect();

// run server
app.listen(port, (error) => {
  let log = {
    Server: {
      Port: port,
      State: !error ? "Conencted." : "ERROR.",
    },
    Database: {
      Port: db.connection.port,
      State: db.connection._readyState === 1 ? "Connected." : "ERROR.",
    },
  };
  console.table(log);
});
