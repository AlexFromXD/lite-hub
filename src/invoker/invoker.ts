import { URL } from "url";
import { config } from "../config";
import { FunctionNotFoundError } from "../exception";
import { HttpRequest } from "../schema/http-request";
import { HttpResponse } from "../schema/http-response";
import { RestRequest } from "../schema/rest-request";
import { WSRequest } from "../schema/ws-request";
import { throttle } from "../throttle";
import { httpInvokeTask, wsInvokeTask } from "./tasks";

export class Invoker {
  getUrl(functionName: string): URL {
    const origin = config.getOriginByFunction(functionName);
    if (!origin) {
      throw new FunctionNotFoundError(functionName);
    }
    return new URL("/2015-03-31/functions/function/invocations", origin);
  }

  async httpInvoke(
    functionName: string,
    event: HttpRequest | RestRequest,
  ): Promise<HttpResponse> {
    const functionUrl = this.getUrl(functionName);
    return throttle.add(functionName, httpInvokeTask(functionUrl)(event));
  }

  async wsInvoke(
    functionName: string,
    event: WSRequest,
  ): Promise<HttpResponse> {
    const functionUrl = this.getUrl(functionName);
    return throttle.add(functionName, wsInvokeTask(functionUrl)(event));
  }
}
