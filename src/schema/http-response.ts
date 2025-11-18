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
