import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/route.js";
import { useConnect } from "./database/db.js";
import ENV from "./config.js";

// init app
const app = express();

// middlewares

// origins to allow
const whitelist = ["http://localhost:3000"];

app.options("*", cors()); // pre-flight enabled
// CORS option
const corsOption = {
  credential: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS."));
    }
  },
};
app.use(cors(corsOption));

app.use(express.json());
app.use(morgan("tiny"));
app.disable("x-powered-by");

// context
const port = ENV.SERVER_PORT;

// Default GET Request
app.get("/", (req, res) => {
  res.status(201).json("Server is running...");
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
      State: 1 ? "Connected." : "ERROR.",
    },
  };
  console.table(log);
});
