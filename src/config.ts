import { logger } from "./logger";

/** Delimiter for environment variables to be parsed as arrays */
const envArrayFieldDelimiter = ",";

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
        if (!path || !functionName) {
          throw new Error(`Invalid PATH_MAPPING format found: ${x}`);
        }
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

    return undefined;
  }

  /**
   * @description separated by comma
   */
  private readonly _corsAllowOrigin = process.env.CORS_ALLOW_ORIGIN;

  getCorsAllowOrigin(): string[] {
    return this._corsAllowOrigin?.split(",") || [];
  }

  /**
   * @description separated by comma
   */
  private readonly _httpV1PayloadFunctionNameMap = new Map<string, undefined>(
    process.env.HTTP_V1_PAYLOAD_FUNCTIONS?.split(envArrayFieldDelimiter)?.map(
      (functionName) => [functionName, undefined],
    ) || [],
  );

  isFunctionOnV1HttpRequestPayload(functionName: string): boolean {
    return this._httpV1PayloadFunctionNameMap.has(functionName);
  }

  constructor() {
    logger.info("found path:");
    for (const [key, functionName] of Object.entries(this._pathMapping)) {
      const origin = this.getOriginByFunction(functionName);
      if (origin) {
        logger.info(
          `- ${key} => ${functionName} (${origin}) ${this.isFunctionOnV1HttpRequestPayload(functionName) ? "[on AWS API Gateway payload format 1.0]" : ""}`,
        );
      }
    }
  }
}

const config = new Config();

export { config };
