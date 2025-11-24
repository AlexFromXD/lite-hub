import { URL } from "node:url";
import axios from "axios";
import { HttpRequest } from "../schema/http-request";
import { HttpResponse } from "../schema/http-response";
import { RestRequest } from "../schema/rest-request";
import { WSRequest } from "../schema/ws-request";

export const httpInvokeTask =
  (url: URL) =>
  (event: HttpRequest | RestRequest) =>
  async (): Promise<HttpResponse> => {
    const res = await axios.post(url.href, event);

    // TODO: Infer response in 2.0 format
    // "With the 2.0 format version, API Gateway can infer the response format for you."
    // Ref: http-api-develop-integrations-lambda.v2

    return res.data;
  };

export const wsInvokeTask =
  (url: URL) => (event: WSRequest) => async (): Promise<HttpResponse> => {
    const res = await axios.post(url.href, event, {
      headers: {
        "x-amz-invocation-type": "Event",
        "Content-Type": "application/json",
      },
    });
    return res.data;
  };
