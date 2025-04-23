import axios from "axios";
import { URL } from "url";
import { config } from "./config";
import { FunctionNotFoundError } from "./exception";
import { HttpRequest } from "./schema/http-request";
import { HttpResponse } from "./schema/http-response";
import { WSRequest } from "./schema/ws-request";
import { throttle } from "./throttle";

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
    event: HttpRequest,
  ): Promise<HttpResponse> {
    return throttle.add(functionName, async () => {
      const url = this.getUrl(functionName);
      const res = await axios.post(url.href, event);
      return res.data;
    });
  }

  async wsInvoke(
    functionName: string,
    event: WSRequest,
  ): Promise<HttpResponse> {
    return throttle.add(functionName, async () => {
      const url = this.getUrl(functionName);
      const res = await axios.post(url.href, event, {
        headers: {
          "x-amz-invocation-type": "Event",
          "Content-Type": "application/json",
        },
      });
      return res.data;
    });
  }
}
