const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

export class Logger {
  info(...args: unknown[]) {
    console.log(`${COLORS.green}[INFO]${COLORS.reset}`, ...args);
  }

  warn(...args: unknown[]) {
    console.log(`${COLORS.yellow}[WARN]${COLORS.reset}`, ...args);
  }

  error(...args: unknown[]) {
    console.error(`${COLORS.red}[ERROR]${COLORS.reset}`, ...args);
  }
}

const logger = new Logger();

export { logger };
