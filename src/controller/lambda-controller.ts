import express, { Request, Response } from "express";
import { createProxyServer } from "http-proxy";
import morgan from "morgan";
import { config } from "../config";
import { errorHandler } from "../exception";
import { Invoker } from "../invoker";
import { logger } from "../logger";
import { throttle } from "../throttle";
import { Controller } from "./controller";
/**
 * @description The Lambda service simulator. Handle Lambda Invocation.
 */
export class LambdaController implements Controller {
  private readonly _app;
  private readonly _proxy;
  private readonly _invoker: Invoker;
  private readonly _port = config.port + 2;

  constructor() {
    this._app = express();
    this._proxy = createProxyServer();
    this._invoker = new Invoker();
  }

  init() {
    this._app
      .use(morgan("tiny"))
      .post(
        "/2015-03-31/functions/:functionName/invocations",
        async (req, res) => {
          const functionName = req.params.functionName;
          const invocationType =
            req.header("X-Amz-Invocation-Type") ?? "RequestResponse";

          if (invocationType === "Event") {
            this._asyncHandler(req, res, functionName);
          } else {
            await this._syncHandler(req, res, functionName);
          }
        },
      )
      .listen(this._port, () => {
        logger.info(
          `LambdaController is listening on port ${this._port}`,
        );
      });
  }

  _asyncHandler(req: Request, res: Response, functionName: string) {
    logger.info("[Async Invoke]");
    let data = "";

    req
      .setEncoding("utf8")
      .on("data", (chunk) => {
        data += chunk;
      })
      .on("end", () => {
        req.body = data;
        logger.info("body: ", req.body);
        this._invoker.httpInvoke(functionName, req.body).catch(errorHandler);
        res.status(202).send("Accepted");
      });
  }

  async _syncHandler(req: Request, res: Response, functionName: string) {
    const task = async () => {
      const url = this._invoker.getUrl(functionName);
      req.url = url.pathname;
      this._proxy.web(
        req,
        res,
        {
          target: url.origin,
        },
        (err) => {
          errorHandler(err);
          res.status(502).send("Bad Gateway");
        },
      );
    };

    await throttle.add(functionName, task);
  }
}
