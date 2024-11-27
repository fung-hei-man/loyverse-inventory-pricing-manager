import { createLogger, format, transports, addColors } from 'winston';

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 2,
    store: 2,
    debug: 2,
  },
  colors: {
    error: 'red',
    warn: 'yellowBG',
    info: 'blue',
    http: 'magenta',
    store: 'cyan',
    debug: 'grey',
  },
};

addColors(logLevels.colors);

export const logger = createLogger({
  levels: logLevels.levels,
  format: format.combine(
    format.json(),
    format.colorize({
      all: true,
    }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.splat(),
    format.simple(),
    format.printf(
      (info) => `[${info.timestamp}] [${info.level}] ${info.message}`
    )
  ),
  transports: [new transports.Console({ handleExceptions: true })],
  exitOnError: false,
});

// handling Uncaught Promise Rejections
logger.rejections.handle(new transports.Console());
