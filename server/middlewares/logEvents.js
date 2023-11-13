import { v4 } from "uuid";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import { format } from "date-fns";

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${v4()}\t${message}\n`;
  const __dirname = path.resolve(path.dirname(""));

  try {
    // if not exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs")))
      await fsPromise.mkdir(path.join(__dirname, "..", "logs"));
    // if exist
    await fsPromise.access.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (error) {
    throw new Error(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`);
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logEvents, logger };
