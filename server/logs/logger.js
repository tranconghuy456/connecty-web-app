import { format, transports, createLogger } from "winston";

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "server.log" }),
  ],

  format: format.combine(
    format.label({ label: "[LOGGER]" }),
    format.json(),
    format.colorize({ all: true }),
    format.timestamp({
      format: "YYYY:MM:DD HH:mm:ss",
    }),
    format.printf(
      (log) => `[${log.timestamp}]: ${log.message}  - [level: ${log.level}]`
    )
  ),
});

export const logHandler = (req, res, next) => {
  // handle if res finish
  res.on("finish", () => {
    let { statusCode } = res;
    let { method, url } = req;

    if (statusCode < 400)
      // if success
      logger.log("info", `[${method} => ${url}] - ${statusCode}`);
    // if error
    else logger.log("error", `[${method} => ${url}] - ${statusCode}`);
  });
  next();
};

export default logger;
