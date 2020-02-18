import { createLogger, format, transports, Logger as winstonLogger } from "winston";

/**
 * Wrapper class for winston logger.
 * Implements a singletong instace of the logger.
 */
class Logger {
  public static get logger() {
    return this._getInstance()._logger;
  }

  private static instance: Logger;
  private static readonly env = process.env.NODE_ENV || "development";
  private _logger: winstonLogger;

  /* Singelton of logger which will be used across the app */
  private static _getInstance(): Logger {
    if (!this.instance)
      this.instance = new Logger(this.env);
    // return initialized logger
    return this.instance;
  }

  private constructor(env: string) {
    this._logger = createLogger({
      // set the format of the logger
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
      // change level if in dev environment versus production
      level: env === "development" ? "debug" : "info",
      transports: [
        new transports.Console(),
      ],
    });
  }
}

export default Logger.logger;