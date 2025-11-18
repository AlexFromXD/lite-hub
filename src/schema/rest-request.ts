import { Request } from "express";

/**
 * @description The event that API Gateway, for REST APIs, send to lambda
 * @see {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format-structure | AWS documentation}
 */
export class RestRequest {
  version = "1.0";
  resource: string = "/my/path";
  path: string = "/my/path";
  httpMethod: string = "GET";
  headers: Record<string, string> = {};
  multiValuesHeaders: Record<string, string[]> = {};
  queryStringParameters: Record<string, string> = {};
  multiValueQueryStringParameters: Record<string, string[]> = {};
  requestContext: {
    accountId: string;
    apiId: string;
    authorizer?: {
      claims: Record<string, string> | null;
      scopes: string[] | null;
    };
    domainName?: string;
    domainPrefix?: string;
    extendedRequestId?: string;
    httpMethod: string;
    identity: {
      accessKey: string | null;
      accountId: string | null;
      caller: string | null;
      cognitoAuthenticationProvider: string | null;
      cognitoAuthenticationType: string | null;
      cognitoIdentityId: string | null;
      cognitoIdentityPoolId: string | null;
      principalOrgId: string | null;
      sourceIp: string;
      user: string | null;
      userAgent: string;
      userArn: string | null;
      clientCert: {
        clientCertPem: string;
        subjectDN: string;
        issuerDN: string;
        serialNumber: string;
        validity: {
          notBefore: string;
          notAfter: string;
        };
      };
    };
    path: string;
    protocol: string;
    requestId: string;
    requestTime: string;
    requestTimeEpoch: number;
    resourceId: null;
    resourcePath: string;
    stage: string;
  };

  pathParameters: Record<string, string> = {};
  stageVariables: Record<string, string> = {};

  /**
   * @see {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v1 | AWS documentation}
   */
  body: string = "";

  isBase64Encoded: boolean = false;

  constructor(req: Request) {
    const apiId = "dIipa";
    this.queryStringParameters = req.query as Record<string, string>;
    this.headers = req.headers as Record<string, string>;

    // Ensure body is serialized to string
    this.body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const date = new Date();
    this.requestContext = {
      accountId: "123456789012",
      apiId,
      domainName: `${apiId}.execute-api.us-east-1.amazonaws.com`,
      domainPrefix: apiId,
      path: req.path,
      extendedRequestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
      httpMethod: req.method,
      identity: {
        accessKey: null,
        accountId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: req.ip || "127.0.0.1",
        user: null,
        userAgent: req.get("User-Agent") || "",
        userArn: null,
        clientCert: {
          clientCertPem: "SOME_CERT_CONTENT",
          subjectDN: "www.example.com",
          issuerDN: "Some issuer",
          serialNumber: "a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1",
          validity: {
            notBefore: "May 28 12:30:02 2019 GMT",
            notAfter: "Aug 5 09:36:04 2021 GMT",
          },
        },
      },
      requestTime: date.toISOString(),
      requestTimeEpoch: date.getTime(),
      stage: "$default",
      resourceId: null,
      resourcePath: req.path,
      requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
      protocol: "HTTP/1.1",
    };
  }
}
