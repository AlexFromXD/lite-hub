/**
 * @description response from lambda
 * @ref https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-integration-settings-integration-response.html
 */
export type HttpResponse = {
  isBase64Encoded: boolean;
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};
