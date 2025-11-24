import { URL } from "node:url";
import axios from "axios";
import { HttpRequest } from "../schema/http-request";
import { HttpResponse, isHttpResponse } from "../schema/http-response";
import { RestRequest } from "../schema/rest-request";
import { WSRequest } from "../schema/ws-request";

export const httpInvokeTask =
  (url: URL) =>
  (event: HttpRequest | RestRequest) =>
  async (): Promise<HttpResponse> => {
    const res = await axios.post(url.href, event);

    // For REST APIs, the response format must conform to v1.0 format.
    if (event instanceof RestRequest) {
      if (!isHttpResponse(res.data)) {
        throw Error(
          `Invalid response format from function "${url.href}". AWS API Gateway REST APIs integration expects lambda to return response in specified format on documentation. See https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v1 for more details.`,
        );
      }
    }

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
