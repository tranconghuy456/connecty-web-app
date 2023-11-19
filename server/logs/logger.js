import { format, transports, createLogger } from "winston";
import httpContext from "express-http-context";

const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.label({ label: "[LOGGER]" }),
    format.colorize({ all: true }),
    format.timestamp({
      format: "YYYY:MM:DD HH:mm:ss",
    }),
    format.printf(
      (log) => `[${log.timestamp}]: ${log.message}  - [level: ${log.level}]`
    )
  ),
});

export default logger;
