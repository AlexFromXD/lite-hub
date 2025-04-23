import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "../config";
import { errorHandler, PathError } from "../exception";
import { Invoker } from "../invoker";
import { logger } from "../logger";
import { HttpRequest } from "../schema/http-request";
import { Controller } from "./controller";

/**
 * @description The API Gateway simulator. Forwarding http requests to specific function.
 */
export class HttpController implements Controller {
  private readonly _app;
  private readonly _invoker: Invoker;
  private readonly _ignoredPaths: string[] = ["/favicon.ico"];
  private readonly _port = config.port;

  constructor() {
    this._app = express();
    this._invoker = new Invoker();
  }

  init() {
    this._app
      .use(morgan("tiny"))
      .use(
        cors({
          credentials: true,
          origin: (origin, callback) => {
            if (!origin || config.getCorsAllowOrigin().includes(origin)) {
              callback(null, origin);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          },
        }),
      )
      .use(bodyParser.json())
      .use(bodyParser.text({ type: "*/*" }))
      .all("*", async (req, res) => {
        const path = req.path;
        if (this._ignoredPaths.includes(path)) {
          res.status(404).send("Not Found");
          return;
        }

        const functionName = config.getFunctionByPath(path);
        if (!functionName) {
          throw new PathError(req.path);
        }

        const event = new HttpRequest(req);
        try {
          const result = await this._invoker.httpInvoke(functionName, event);
          res.status(result.statusCode).send(result.body);
        } catch (error) {
          errorHandler(error);
          res.status(502).send("Bad Gateway");
        }
      })
      .listen(this._port, () => {
        logger.info(`HttpController is listening on port ${this._port}`);
      });
  }
}
