import { URL } from "node:url";
import axios from "axios";
import { HttpRequest } from "../schema/http-request";
import {
  HttpResponse,
  isHttpResponse,
  isInferableHttpResponse,
  newInferredHttpResponse,
} from "../schema/http-response";
import { RestRequest } from "../schema/rest-request";
import { WSRequest } from "../schema/ws-request";

export const httpInvokeTask =
  (url: URL) =>
  (event: HttpRequest | RestRequest) =>
  async (): Promise<HttpResponse> => {
    const res = await axios.post(url.href, event);
    const responseData = res.data;

    // For REST APIs, the response format must conform to v1.0 format.
    if (event instanceof RestRequest) {
      if (!isHttpResponse(responseData)) {
        throw Error(
          `Invalid response format from function "${url.href}". AWS API Gateway REST APIs integration expects lambda to return response in specified format on documentation. See https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v1 for more details.`,
        );
      }

      return responseData;
    }

    // For HTTP APIs (HttpRequest), if the response is not in HttpResponse format,
    // we try infer it according to the v2.0 format rules.
    if (!isInferableHttpResponse(responseData)) {
      if (!isHttpResponse(responseData)) {
        throw Error(
          `Invalid response format from function "${url.href}". AWS API Gateway HTTP APIs integration expects lambda to return response in specified format on documentation. Current lambda response will cause API Gateway to fail on responding. See https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v2 for more details.`,
        );
      }

      return responseData;
    }

    return newInferredHttpResponse(responseData);
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
