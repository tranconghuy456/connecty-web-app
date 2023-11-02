import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/User.route.js";
import { useConnect } from "./helpers/db_connection_single.js";
import ENV from "./config.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// init app
const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

// server request bandwidth
const bodyOpt = {
  bandwidth: {
    limit: "10mb",
  },
  encoded: {
    extended: true,
    limit: "10mb",
  },
};
app.use(bodyParser.json(bodyOpt.bandwidth));
app.use(bodyParser.urlencoded(bodyOpt.encoded));

// context
const port = ENV.SERVER_PORT;

// Default GET Request
app.get("/", (req, res, next) => {
  res.send("Home request /");
});

// API routes
app.use("/api", router);

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
