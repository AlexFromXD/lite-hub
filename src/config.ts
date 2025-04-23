import { logger } from "./logger";

class Config {
  readonly port = 3000;
  /**
   * @description The function to handle websocket event.
   */
  readonly wsFunction = process.env.WS_FUNCTION;

  /**
   * @example "ws=ws:8080,http=http:8081"
   */
  private readonly _functionEndpoint = Object.fromEntries(
    process.env.FUNCTION_ENDPOINT?.split(",").map((x) => x.split("=")) || [],
  );
  getOriginByFunction(name: string): string | undefined {
    return this._functionEndpoint[name];
  }

  private readonly _pathMapping = Object.fromEntries(
    process.env.PATH_MAPPING?.split(",")
      .map((x) => {
        const [path, functionName] = x.split("=");
        return {
          path: path.split("/"),
          functionName,
        };
      })
      .sort((a, b) => b.path.length - a.path.length)
      .map((x) => [x.path.join("/"), x.functionName]) || [],
  );

  getFunctionByPath(path: string): string | undefined {
    for (const [key, value] of Object.entries(this._pathMapping)) {
      if (path.startsWith(key)) {
        return value as string;
      }
    }

    if (this._pathMapping["/*"]) {
      return this._pathMapping["/*"];
    }
  }

  /**
   * @description separated by comma
   */
  private readonly _corsAllowOrigin = process.env.CORS_ALLOW_ORIGIN;

  getCorsAllowOrigin(): string[] {
    return this._corsAllowOrigin?.split(",") || [];
  }

  constructor() {
    logger.info("found path:");
    for (const [key, value] of Object.entries(this._pathMapping)) {
      logger.info(`- ${key} => ${value} (${this.getOriginByFunction(value)})`);
    }
  }
}

const config = new Config();

export { config };
