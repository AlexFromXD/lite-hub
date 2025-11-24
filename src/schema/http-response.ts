/**
 * @description Response from lambda. Should be auto inferred when on API Gateway payloadFormatVersion is "2.0"
 *
 * @see {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format | AWS API Getaway proxy integration documentation}
 * @see {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-integration-settings-integration-response.html | AWS API Gateway non proxy documentation}
 */
export type HttpResponse = {
  isBase64Encoded: boolean;
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

/**
 * @private Use 3rd-party validation library if needed.
 *
 * @description Pure-JS validation to check if the given data is in HttpResponse format.
 *
 * @see {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v1}
 */
export const isHttpResponse = (data: unknown): data is HttpResponse => {
  if (!data || typeof data !== "object") return false;

  if (!("statusCode" in data) || typeof data.statusCode !== "number")
    return false;

  if (!("isBase64Encoded" in data) || typeof data.isBase64Encoded !== "boolean")
    return false;

  if (!("body" in data) || typeof data.body !== "string") return false;

  // headers is optional
  if ("headers" in data) {
    for (const headerValue of Object.values(
      data.headers as Record<string, unknown>,
    )) {
      if (typeof headerValue !== "string") return false;
    }
  }

  return true;
};
